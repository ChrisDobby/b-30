<script lang="ts">
    import type { DisplayActivity, LapAnalysis } from "$lib/types";
    import ActivityCharts from "$lib/activityCharts.svelte";
    import Select, { Option } from "@smui/select";
    import { fade } from "svelte/transition";

    export let activity: DisplayActivity;

    const lapWithPace = activity.analysis.laps.find(lap => lap.pace !== "other");
    let displayedLapIndex = activity.analysis.laps.indexOf(lapWithPace) || 0;
    let displayLap: LapAnalysis;
    $: displayLap = activity.analysis.laps[displayedLapIndex];
</script>

<Select style="border-radius: 0 28px 28px 0" variant="outlined" label="Lap" bind:value={displayedLapIndex}>
    {#each activity.analysis.laps as lap, index}
        <Option value={index}>{lap.name}</Option>
    {/each}
</Select>
<div in:fade>
    <ActivityCharts analysis={displayLap} />
</div>
