<script lang="ts">
    import PaceEntry from "$lib/paceEntry.svelte";
    import { calculatePacesFromTime, getPacesForDateTime } from "$lib/utils";
    import { session } from "$app/stores";
    import PaceGrid from "$lib/paceGrid.svelte";
    import Snackbar, { Label, SnackbarComponentDev } from "@smui/snackbar";
    import Button from "@smui/button";
    import resilientFetch from "$lib/resilientFetch";

    import "../app.scss";

    const currentPaces = getPacesForDateTime(new Date(), $session.times);
    let date5k = currentPaces ? Math.round(currentPaces.date5k / 5) : 360;

    $: paces = calculatePacesFromTime(date5k * 5);

    let settingTimes: boolean;
    let errorSnackbar: SnackbarComponentDev;

    export let onChange: () => void;
    export let onCancel: () => void;

    const f = resilientFetch(fetch);
    async function handleSubmit() {
        settingTimes = true;
        try {
            const response = await f("/api/setTimes", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${$session.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ paces }),
            });

            if (response.ok) {
                const { times } = await response.json();
                $session.times = times;
                onChange();
            } else {
                errorSnackbar.open();
                settingTimes = false;
            }
        } catch (e) {
            errorSnackbar.open();
            settingTimes = false;
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} method="post">
    <fieldset>
        <legend>Enter your 5k times</legend>
        <PaceEntry label="Date 5k time" distance={5000} bind:secondsPerKm={date5k} bind:disabled={settingTimes} />
        <PaceGrid {paces} measurementPreference={$session.measurementPreference} />
        <div class="buttons">
            <Button type="submit" disabled={settingTimes} variant="raised">
                {settingTimes ? "Setting times..." : "Set times"}
            </Button>
            <Button type="button" on:click={onCancel} disabled={settingTimes} variant="raised" color="secondary"
                >Cancel</Button
            >
        </div>
    </fieldset>
</form>

<Snackbar bind:this={errorSnackbar}><Label>Something went wrong setting the times. Please try again.</Label></Snackbar>

<style>
    fieldset {
        padding: 1em;
        border-radius: 10px;
        border-width: 1px;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 1em;
        column-gap: 1em;
    }
</style>
