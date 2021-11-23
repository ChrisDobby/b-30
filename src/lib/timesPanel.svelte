<script lang="ts">
    import type { Times } from "$lib/types";
    import { timeFromSeconds, calculateSpeedAndPace, secondsForUnit, MEASUREMENT_UNITS } from "$lib/utils";
    import { session } from "$app/stores";

    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);
    const getSeconds = secondsForUnit($session.measurementPreference);
    const units = MEASUREMENT_UNITS[$session.measurementPreference];
    export let times: Times;
    let showingPaces = false;
</script>

<button on:click={() => (showingPaces = !showingPaces)}>
    {`Date 5k time: ${timeFromSeconds(times.date5k)} at ${getSpeedAndPace(5000 / times.date5k)[1]}`}
    <i class={`arrow ${showingPaces ? "up" : "down"}`} />
</button>

{#if showingPaces}
    <div class="paces">
        <p class="name">Recovery</p>
        <p>
            {`${timeFromSeconds(getSeconds(times.recovery.low), false)} - ${timeFromSeconds(
                getSeconds(times.recovery.high),
            )}/${units}`}
        </p>
        <p class="name">Tempo</p>
        <p>
            {`${timeFromSeconds(getSeconds(times.tempo.low), false)} - ${timeFromSeconds(
                getSeconds(times.tempo.high),
            )}/${units}`}
        </p>
        <p class="name">5k</p>
        <p>
            {`${timeFromSeconds(getSeconds(times.five.low), false)} - ${timeFromSeconds(
                getSeconds(times.five.high),
            )}/${units}`}
        </p>
        <p class="name">Overpace</p>
        <p>
            {`${timeFromSeconds(getSeconds(times.overPace.low), false)} - ${timeFromSeconds(
                getSeconds(times.overPace.high),
            )}/${units}`}
        </p>
        <p class="name">Strides</p>
        <p>
            {`${timeFromSeconds(getSeconds(times.strides.low), false)} - ${timeFromSeconds(
                getSeconds(times.strides.high),
            )}/${units}`}
        </p>
    </div>
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
    p {
        margin: 0;
    }

    .paces {
        display: grid;
        grid-template-columns: max-content 1fr;
        column-gap: 1em;
        margin-top: 1em;
    }

    .name {
        font-weight: 700;
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
