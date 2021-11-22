<script lang="ts">
    import type { Times } from "$lib/types";
    import { timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";
    import Button from "@smui/button";

    export let times: Times;
    let showingPaces = false;
</script>

<p>
    {`Date 5k time: ${timeFromSeconds(times.date5k)} at ${calculateSpeedAndPace(5000 / times.date5k)[1]}`}
</p>

<Button on:click={() => (showingPaces = !showingPaces)}>{showingPaces ? "Hide paces" : "View paces"}</Button>

{#if showingPaces}
    <div class="paces">
        <p class="name">Recovery</p>
        <p>
            {`${timeFromSeconds(times.recovery.low, false)} - ${timeFromSeconds(times.recovery.high)}/km`}
        </p>
        <p class="name">Tempo</p>
        <p>
            {`${timeFromSeconds(times.tempo.low, false)} - ${timeFromSeconds(times.tempo.high)}/km`}
        </p>
        <p class="name">5k</p>
        <p>
            {`${timeFromSeconds(times.five.low, false)} - ${timeFromSeconds(times.five.high)}/km`}
        </p>
        <p class="name">Overpace</p>
        <p>
            {`${timeFromSeconds(times.overPace.low, false)} - ${timeFromSeconds(times.overPace.high)}/km`}
        </p>
        <p class="name">Strides</p>
        <p>
            {`${timeFromSeconds(times.strides.low, false)} - ${timeFromSeconds(times.strides.high)}/km`}
        </p>
    </div>
{/if}

<style>
    p {
        margin: 0;
    }

    .paces {
        display: grid;
        grid-template-columns: max-content 1fr;
        column-gap: 1em;
    }

    .name {
        font-weight: 700;
    }
</style>
