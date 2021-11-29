<script lang="ts">
    import type { DisplayActivity } from "$lib/types";
    import { distance, timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";
    import { session } from "$app/stores";

    const getDistance = distance($session.measurementPreference);
    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    export let activity: DisplayActivity;
</script>

<div class="activity">
    <h2 class="activity-name">{activity.name}</h2>
    <p class="activity-detail">{activity.dateTime}</p>
    <p class="activity-detail">
        {`${getDistance(activity.distance)} in ${timeFromSeconds(activity.movingTime)} at ${
            getSpeedAndPace(activity.averageSpeed)[1]
        }`}
    </p>
</div>

<style>
    .activity {
        text-align: center;
    }

    .activity-name {
        margin: 0;
        font-size: 2em;
    }

    .activity-detail {
        margin: 0;
        font-size: 1em;
    }
</style>
