<script lang="ts">
    import type { AnalysisResult } from "./types";
    import Doughnut from "svelte-chartjs/src/Doughnut.svelte";
    import Bar from "svelte-chartjs/src/Bar.svelte";

    export let analysis: AnalysisResult;
    const display = {
        recovery: { colour: "blue", label: "Recovery" },
        tempo: { colour: "green", label: "Tempo" },
        five: { colour: "yellow", label: "5K" },
        overPace: { colour: "orange", label: "Over pace" },
        strides: { colour: "red", label: "Strides" },
        other: { colour: "gray", label: "Other" },
    };

    const displayData = Object.entries(analysis.percentageOfTimeAtPace).reduce(
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

    const timeData = {
        labels: displayData.times.map(([key, value]) => `${display[key].label} ${value}%`),
        datasets: [
            {
                data: displayData.times.map(([_, value]) => value),
                backgroundColor: displayData.times.map(([key]) => display[key].colour),
                borderWidth: 0,
            },
        ],
    };

    const heartrateData = {
        labels: displayData.heartRates.map(({ key, value }) => `${display[key].label} ${value}`),
        datasets: [
            {
                label: "Heartrate",
                data: displayData.heartRates.map(({ value }) => value),
                backgroundColor: displayData.heartRates.map(({ key }) => display[key].colour),
            },
        ],
    };
</script>

<Doughnut
    data={timeData}
    options={{ responsive: true, plugins: { title: { display: true, text: "% of time at pace" } } }}
/>
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
