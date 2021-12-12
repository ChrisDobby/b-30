<script lang="ts">
    import type { DisplayActivity } from "$lib/types";
    import { distance, timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";
    import { session } from "$app/stores";
    import ActivityCharts from "$lib/activityCharts.svelte";
    import LapChart from "$lib/lapChart.svelte";
    import LapSelect from "$lib/lapSelect.svelte";
    import Paper, { Content } from "@smui/paper";

    const getDistance = distance($session.measurementPreference);
    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    export let activity: DisplayActivity;
    export let notCurrentPaces = false;
</script>

<div class="activity">
    {#if activity && notCurrentPaces}
        <div class="warning">
            <Paper color="primary" style="padding: 0.85rem">
                <Content style="font-size: 0.85rem; line-height: 1.25">
                    This display is using paces from the date of the activity which are different to your current paces.</Content
                >
            </Paper>
        </div>
    {/if}

    <div>
        <h2 class="activity-name">{activity.name}</h2>
        <p class="activity-detail">{activity.dateTime}</p>
        <p class="activity-detail">
            {`${getDistance(activity.distance)} in ${timeFromSeconds(activity.movingTime)} at ${
                getSpeedAndPace(activity.averageSpeed)[1]
            }`}
        </p>
    </div>
    <div class="activity-data">
        <ActivityCharts analysis={activity.analysis} />
        <LapChart laps={activity.analysis.laps} />
        <hr />
        <LapSelect {activity} />
    </div>
</div>

<style>
    .activity {
        text-align: center;
        padding-right: 16px;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: hidden;
    }

    .activity-name {
        margin: 0;
        font-size: 2em;
    }

    .activity-detail {
        margin: 0;
        font-size: 1em;
    }

    .activity-data {
        padding: 1em;
        flex: 1;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        row-gap: 1em;
    }

    .warning {
        margin-right: 16px;
    }

    hr {
        width: 100%;
        color: var(--mdc-theme-on-secondary, #fff);
    }
</style>
