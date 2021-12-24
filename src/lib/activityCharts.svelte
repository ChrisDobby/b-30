<script lang="ts">
    import type { Analysis } from "./types";
    import Doughnut from "svelte-chartjs/src/Doughnut.svelte";
    import Bar from "svelte-chartjs/src/Bar.svelte";
    import Line from "svelte-chartjs/src/Line.svelte";
    import { CHART_DISPLAY } from "$lib/utils";

    export let analysis: Analysis;

    let displayData;
    let timeData;
    let heartrateData;
    let speedData;

    $: {
        displayData = Object.entries(analysis.percentageOfTimeAtPace).reduce(
            (acc, entry) => {
                const [key, value] = entry;
                const showTime = value >= 1;
                const showHeartRate = value > 5;
                if (showTime) {
                    acc.times.push(entry);
                }

                if (showHeartRate && analysis.averageHeartRateAtPace[key]) {
                    acc.heartRates.push({ key, value: analysis.averageHeartRateAtPace[key] });
                }

                return acc;
            },
            { times: [], heartRates: [] },
        );

        timeData = {
            labels: displayData.times.map(([key, value]) => `${CHART_DISPLAY[key].label} ${value}%`),
            datasets: [
                {
                    data: displayData.times.map(([_, value]) => value),
                    backgroundColor: displayData.times.map(([key]) => CHART_DISPLAY[key].colour),
                    borderWidth: 0,
                },
            ],
        };

        const heartratesToDisplay = displayData.heartRates.filter(({ key }) => CHART_DISPLAY[key].isPrimaryPace);
        heartrateData = {
            labels: heartratesToDisplay.map(({ key, value }) => `${CHART_DISPLAY[key].label} ${value}`),
            datasets: [
                {
                    label: "Heartrate",
                    data: heartratesToDisplay.map(({ value }) => value),
                    backgroundColor: heartratesToDisplay.map(({ key }) => CHART_DISPLAY[key].colour),
                },
            ],
        };

        speedData = {
            labels: analysis.speed,
            datasets: [
                {
                    label: "Pace",
                    data: analysis.speed,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        };
    }
</script>

<div>
    <Line
        data={speedData}
        options={{
            responsive: true,
            elements: { point: { radius: 0 }, line: { borderWidth: 1 } },
            scales: {
                x: { ticks: { display: false } },
                y: { ticks: { display: false } },
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Pace",
                },
            },
        }}
    />
</div>
<div class="chart">
    <Doughnut
        data={timeData}
        options={{
            responsive: true,
            plugins: { legend: { display: false }, title: { display: true, text: "% of distance at pace" } },
        }}
    />
</div>
{#if heartrateData.labels.length > 0}
    <div class="chart">
        <Bar
            data={heartrateData}
            options={{
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: "Average heart rate at pace",
                    },
                },
            }}
        />
    </div>
{/if}

<style>
    .chart {
        max-width: 450px;
    }
</style>
