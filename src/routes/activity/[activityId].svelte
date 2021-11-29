<script context="module" lang="ts">
    import { analyseStreams } from "$lib/analysis";

    import { securePage } from "$lib/authentication";
    import resilientFetch from "$lib/resilientFetch";

    export const load = securePage(async ({ session, fetch, page }) => {
        if (!session.times) {
            return { props: { noTimes: true } };
        }

        const f = resilientFetch(fetch);
        const { activityId } = page.params;
        try {
            const getActivity = f(`https://www.strava.com/api/v3/activities/${activityId}?include_all_efforts=false`, {
                headers: { Authorization: `Bearer ${session.token}` },
            });
            const getStreams = f(
                `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=velocity_smooth,heartrate&key_by_type=true`,
                {
                    headers: { Authorization: `Bearer ${session.token}` },
                },
            );

            const [getActivityResponse, getStreamsResponse] = await Promise.all([getActivity, getStreams]);
            if (!getActivityResponse.ok || !getStreamsResponse.ok) {
                throw new Error(`${getActivityResponse.status} ${getActivityResponse.statusText}`);
            }

            const activity = await getActivityResponse.json();
            const streams = await getStreamsResponse.json();

            const analysis = analyseStreams(
                session.times,
                activity.laps.map(a => ({
                    id: a.id,
                    name: a.name,
                    distance: a.distance,
                    movingTime: a.moving_time,
                    averageSpeed: a.average_speed,
                    startIndex: a.start_index,
                    endIndex: a.end_index,
                })),
                streams.velocity_smooth.data,
                streams.heartrate.data,
            );

            return {
                props: {
                    activity: {
                        name: activity.name,
                        dateTime: format(new Date(activity.start_date), "dd-MMM-yyyy HH:mm"),
                        distance: activity.distance,
                        movingTime: activity.moving_time,
                        averageSpeed: activity.average_speed,
                        analysis,
                    },
                },
            };
        } catch (e) {
            return { props: { error: e.message } };
        }
    });
</script>

<script lang="ts">
    import Paper, { Title, Content } from "@smui/paper";
    import { fade } from "svelte/transition";
    import type { AnalysisResult } from "$lib/types";
    import { format } from "date-fns";

    import "../../app.scss";

    type Activity = {
        name: string;
        dateTime: string;
        distance: number;
        movingTime: number;
        averageSpeed: number;
        analysis: AnalysisResult;
    };
    export let error: string | null = null;
    export let noTimes: boolean = false;
    export let activity: Activity | null = null;
</script>

<svelte:head>
    <title>{activity ? `${activity.name} ${activity.dateTime}` : "Breaking 30"}</title>
</svelte:head>

<div in:fade>
    {#if error}
        <div class="error">
            <Paper color="primary"
                ><Title>Loading error</Title>
                <Content>Something went wrong loading the activity from Strava. Please try again.</Content></Paper
            >
        </div>
    {/if}
    {#if noTimes}
        <div class="error">
            <Paper color="primary"
                ><Title>No paces set</Title>
                <Content>You have no paces set. Set them before trying to view an activity.</Content></Paper
            >
        </div>
    {/if}
    <code>{JSON.stringify(activity, null, 4)} </code>
</div>

<style>
    .error {
        margin-right: 16px;
    }
</style>
