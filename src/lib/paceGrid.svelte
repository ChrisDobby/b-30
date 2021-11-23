<script lang="ts">
    import { timeFromSeconds, secondsForUnit, MEASUREMENT_UNITS } from "$lib/utils";
    import type { MeasurementPreference, Times } from "$lib/types";

    export let times: Times;
    export let measurementPreference: MeasurementPreference;

    const getSeconds = secondsForUnit(measurementPreference);
    const units = MEASUREMENT_UNITS[measurementPreference];
</script>

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
