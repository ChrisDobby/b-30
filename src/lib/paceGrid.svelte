<script lang="ts">
    import { timeFromSeconds, secondsForUnit, MEASUREMENT_UNITS } from "$lib/utils";
    import type { MeasurementPreference, Paces } from "$lib/types";

    export let paces: Paces;
    export let measurementPreference: MeasurementPreference;

    const getSeconds = secondsForUnit(measurementPreference);
    const units = MEASUREMENT_UNITS[measurementPreference];
</script>

<div class="paces">
    <p class="name">Recovery</p>
    <p>
        {`${timeFromSeconds(getSeconds(paces.recovery.low), false)} - ${timeFromSeconds(
            getSeconds(paces.recovery.high),
        )}/${units}`}
    </p>
    <p class="name">Tempo</p>
    <p>
        {`${timeFromSeconds(getSeconds(paces.tempo.low), false)} - ${timeFromSeconds(
            getSeconds(paces.tempo.high),
        )}/${units}`}
    </p>
    <p class="name">5k</p>
    <p>
        {`${timeFromSeconds(getSeconds(paces.five.low), false)} - ${timeFromSeconds(
            getSeconds(paces.five.high),
        )}/${units}`}
    </p>
    <p class="name">Overpace</p>
    <p>
        {`${timeFromSeconds(getSeconds(paces.overPace.low), false)} - ${timeFromSeconds(
            getSeconds(paces.overPace.high),
        )}/${units}`}
    </p>
    <p class="name">Strides</p>
    <p>
        {`${timeFromSeconds(getSeconds(paces.strides.low), false)} - ${timeFromSeconds(
            getSeconds(paces.strides.high),
        )}/${units}`}
    </p>
</div>

<style>
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
</style>
