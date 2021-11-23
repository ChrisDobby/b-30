<script context="module" lang="ts">
    import { securePage } from "$lib/authentication";
    import { format } from "date-fns";
    import { calculateSpeedAndPace, distance, timeFromSeconds } from "$lib/utils";

    export const load = securePage(async ({ session, fetch }) => {
        const activitiesResponse = await fetch("https://www.strava.com/api/v3/athlete/activities", {
            headers: { Authorization: `Bearer ${session.token}` },
        });

        const getDistance = distance(session.measurementPreference);
        const getSpeedAndPace = calculateSpeedAndPace(session.measurementPreference);

        const activities = (await activitiesResponse.json()).map(activity => ({
            id: activity.id,
            name: activity.name,
            date: format(new Date(activity.start_date), "dd-MMM-yyyy HH:mm"),
            distance: getDistance(activity.distance),
            time: timeFromSeconds(activity.moving_time),
            pace: getSpeedAndPace(activity.average_speed)[1],
        }));

        return { props: { activities } };
    });
</script>

<script lang="ts">
    import type { StravaActivity } from "$lib/types";
    import ActivityCard from "$lib/activityCard.svelte";
    import Snackbar, { Label } from "@smui/snackbar";
    import { session } from "$app/stores";
    import "../app.scss";

    export let activities: StravaActivity[];

    let settingTimes: boolean;
    let settingTimesError: boolean;

    const handleSetTimes = (activity: StravaActivity) => async () => {
        settingTimes = true;
        settingTimesError = false;
        try {
            const response = await fetch(`/api/setTimes/${activity.id}`);
            if (!response.ok) {
                settingTimesError = true;
            } else {
                const times = await response.json();
                $session.times = times;
            }
        } catch (e) {
            settingTimesError = true;
        } finally {
            settingTimes = false;
        }
    };
</script>

<ul class="card-display">
    {#each activities as activity}
        <ActivityCard {activity} disabled={settingTimes} onSetTimes={handleSetTimes(activity)} />
    {/each}
</ul>
{#if settingTimesError}
    <Snackbar><Label>There was an error setting the times. Please try again.</Label></Snackbar>
{/if}

<style>
    .card-display {
        margin: 0;
        list-style-type: none;
        padding-left: 0;
    }
</style>
