<script lang="ts">
    import PaceEntry from "$lib/paceEntry.svelte";
    import { calculatePacesFromTime, timeFromSeconds, secondsForUnit, MEASUREMENT_UNITS } from "$lib/utils";
    import { session } from "$app/stores";
    import PaceGrid from "$lib/paceGrid.svelte";

    let date5k = $session.times ? Math.round($session.times.date5k / 5) : 360;

    $: times = calculatePacesFromTime(date5k * 5);
</script>

<form>
    <fieldset>
        <legend>Enter your 5k times</legend>
        <PaceEntry label="Date 5k time" distance={5000} bind:secondsPerKm={date5k} />
        <PaceGrid {times} measurementPreference={$session.measurementPreference} />
    </fieldset>
</form>

<style>
    fieldset {
        padding: 1em;
        border-radius: 10px;
        border-width: 1px;
    }
</style>
