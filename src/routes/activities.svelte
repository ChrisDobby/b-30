<script context="module" lang="ts">
    import { securePage } from "$lib/authentication";
    import { getActivities } from "$lib/utils";

    export const load = securePage(async ({ session, fetch }) => {
        const activities = await getActivities(fetch, session.token, session.measurementPreference, 1);
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

    let loadingPage = false;
    let currentPage = 1;
    let canLoadMore = true;
    async function onScroll(args) {
        if (loadingPage || !canLoadMore) {
            return;
        }

        const atBottom = args.target.scrollTop === args.target.scrollHeight - args.target.offsetHeight;
        if (!atBottom) {
            return;
        }

        loadingPage = true;
        try {
            const activitiesInNewPage = await getActivities(
                fetch,
                $session.token,
                $session.measurementPreference,
                currentPage + 1,
            );
            console.log(activitiesInNewPage);
            canLoadMore = activitiesInNewPage.length > 0;
            activities = [...activities, ...activitiesInNewPage];
        } finally {
            currentPage += 1;
            loadingPage = false;
        }
    }
</script>

<ul class="card-display" on:scroll={onScroll}>
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
        padding-right: 16px;
        height: 100%;
        overflow-y: auto;
    }
</style>
