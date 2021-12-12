<script lang="ts">
    import type { LapAnalysis } from "./types";
    import Bar from "svelte-chartjs/src/Bar.svelte";
    import { CHART_DISPLAY } from "$lib/utils";

    export let laps: LapAnalysis[];

    const data = {
        labels: laps.map(() => ""),
        datasets: [
            {
                label: "Lap",
                data: laps.map(lap => lap.distance),
                backgroundColor: laps.map(lap => CHART_DISPLAY[lap.pace].colour),
            },
        ],
    };
</script>

<Bar
    {data}
    options={{
        responsive: true,
        scales: {
            y: { ticks: { display: false } },
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Lap paces",
            },
        },
    }}
/>
