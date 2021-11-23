<script lang="ts">
    import Slider from "@smui/slider";
    import FormField from "@smui/form-field";
    import { timeFromSeconds, MEASUREMENT_UNITS } from "$lib/utils";
    import { session } from "$app/stores";

    const units = MEASUREMENT_UNITS[$session.measurementPreference];
    export let secondsPerKm = 360;
    export let label: string;
    export let distance: number;
</script>

<p>{label}</p>
<FormField align="end" style="display: flex;">
    <Slider style="flex-grow: 1; margin: 0;" bind:value={secondsPerKm} min={180} max={600} />
</FormField>
<p class="time-description">
    {timeFromSeconds(secondsPerKm * (distance / 1000))}({timeFromSeconds(secondsPerKm)}/{units})
</p>

<style>
    p {
        margin: 0;
    }

    .time-description {
        font-size: 0.8em;
        color: var(--mdc-theme-on-secondary, #999);
    }
</style>
