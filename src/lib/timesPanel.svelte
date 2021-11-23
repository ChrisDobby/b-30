<script lang="ts">
    import type { Times } from "$lib/types";
    import { timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";
    import { session } from "$app/stores";
    import PaceGrid from "$lib/paceGrid.svelte";

    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    export let times: Times;
    let showingPaces = false;
</script>

<button on:click={() => (showingPaces = !showingPaces)}>
    {`Date 5k time: ${timeFromSeconds(times.date5k)} at ${getSpeedAndPace(5000 / times.date5k)[1]}`}
    <i class={`arrow ${showingPaces ? "up" : "down"}`} />
</button>

{#if showingPaces}
    <PaceGrid {times} measurementPreference={$session.measurementPreference} />
{/if}

<style>
    button {
        margin: 0;
        outline: none;
        border: none;
        font-size: 1em;
        background-color: transparent;
        text-align: left;
        color: var(--mdc-theme-on-secondary, #fff);
        padding: 0;
        display: flex;
        align-items: center;
        column-gap: 1em;
    }
    .arrow {
        border: solid var(--mdc-theme-on-secondary, #fff);
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
    }

    .up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
        margin-top: 5px;
    }

    .down {
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        margin-top: -5px;
    }
</style>
