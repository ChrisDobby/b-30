<script lang="ts">
    import type { LapAnalysis } from "./types";
    import Bar from "svelte-chartjs/src/Bar.svelte";
    import { CHART_DISPLAY } from "$lib/utils";

    export let laps: LapAnalysis[];

    const data = {
        labels: laps.map(() => ""),
        datasets: [
            {
                label: CHART_DISPLAY.recovery.label,
                data: laps.map(lap => lap.percentageOfTimeAtPace.recovery),
                backgroundColor: CHART_DISPLAY.recovery.colour,
            },
            {
                label: CHART_DISPLAY.tempo.label,
                data: laps.map(lap => lap.percentageOfTimeAtPace.tempo),
                backgroundColor: CHART_DISPLAY.tempo.colour,
            },
            {
                label: CHART_DISPLAY.five.label,
                data: laps.map(lap => lap.percentageOfTimeAtPace.five),
                backgroundColor: CHART_DISPLAY.five.colour,
            },
            {
                label: CHART_DISPLAY.overPace.label,
                data: laps.map(lap => lap.percentageOfTimeAtPace.overPace),
                backgroundColor: CHART_DISPLAY.overPace.colour,
            },
            {
                label: CHART_DISPLAY.strides.label,
                data: laps.map(lap => lap.percentageOfTimeAtPace.strides),
                backgroundColor: CHART_DISPLAY.strides.colour,
            },
            {
                label: CHART_DISPLAY.other.label,
                data: laps.map(lap => lap.percentageOfTimeAtPace.other),
                backgroundColor: CHART_DISPLAY.other.colour,
            },
        ],
    };
</script>

<Bar
    {data}
    options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Laps",
            },
        },
    }}
/>
