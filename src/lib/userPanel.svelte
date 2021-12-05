<script lang="ts">
    import type { User, Times } from "./types";
    import { session } from "$app/stores";
    import { timeFromSeconds, calculateSpeedAndPace, getPacesForDateTime } from "$lib/utils";
    import PaceGrid from "$lib/paceGrid.svelte";
    import Button from "@smui/button";
    import SetTimesForm from "$lib/setTimesForm.svelte";
    import { slide } from "svelte/transition";

    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    const user = $session.user as User;
    let times = $session.times as Times[] | null;
    session.subscribe(update => {
        times = update.times;
    });

    const currentPaces = getPacesForDateTime(new Date(), times);

    let settingTimes = false;

    const onSettingComplete = () => (settingTimes = false);
</script>

{#if user}
    <div class="user-panel">
        <img src={user.profile} />
        <div class="header">
            <div class="user-name">{`${user.firstName} ${user.lastName}`}</div>
        </div>
        {#if !settingTimes}
            <div class="times-header" in:slide>
                {#if times}
                    <div class="five-k-description">
                        {`Date 5k time: ${timeFromSeconds(currentPaces.date5k)} at ${
                            getSpeedAndPace(5000 / currentPaces.date5k)[1]
                        }`}
                    </div>
                {:else if $session.timesError}
                    <p class="small">Something went wrong getting your paces. Please refresh to try again.</p>
                {:else}
                    <p class="small">You have no paces set</p>
                {/if}
            </div>
        {/if}
        {#if times && !settingTimes}
            <div class="times-detail" in:slide>
                <PaceGrid paces={currentPaces} measurementPreference={$session.measurementPreference} />
            </div>
            <Button disabled={settingTimes} on:click={() => (settingTimes = true)}
                >{times ? "Update paces" : "Set paces"}</Button
            >
        {/if}
        {#if settingTimes}
            <div in:slide>
                <SetTimesForm onCancel={onSettingComplete} onChange={onSettingComplete} />
            </div>
        {/if}
    </div>
{/if}

<style>
    .user-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        background-color: var(--mdc-theme-secondary, #5d5d78);
        color: var(--mdc-theme-on-secondary, #fff);
        border-radius: var(--mdc-shape-medium, 4px);
        padding: 1em;
    }

    .user-panel img {
        width: 5em;
        height: 5em;
        border-radius: 50%;
        margin-right: 1em;
    }
</style>
