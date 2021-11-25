<script lang="ts">
    import type { User, Times } from "./types";
    import { session } from "$app/stores";
    import { timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";
    import PaceGrid from "$lib/paceGrid.svelte";
    import Button from "@smui/button";
    import SetTimesForm from "$lib/setTimesForm.svelte";

    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    const user = $session.user as User;
    let times = $session.times as Times;
    session.subscribe(update => {
        times = update.times;
    });

    let settingTimes = false;

    const onSettingComplete = () => (settingTimes = false);
</script>

{#if user}
    <div class="user-panel">
        <img src={user.profile} />
        <div class="header">
            <div class="user-name">{`${user.firstName} ${user.lastName}`}</div>
        </div>
        <div class={`times-header ${settingTimes ? "disabled" : ""}`}>
            {#if times}
                <div class="five-k-description">
                    {`Date 5k time: ${timeFromSeconds(times.date5k)} at ${getSpeedAndPace(5000 / times.date5k)[1]}`}
                </div>
            {:else}
                <p class="small">You have no paces set</p>
            {/if}
        </div>
        {#if times}
            <div class={`times-detail ${settingTimes ? "disabled" : ""}`}>
                <PaceGrid {times} measurementPreference={$session.measurementPreference} />
            </div>
        {/if}
        <Button disabled={settingTimes} on:click={() => (settingTimes = true)}
            >{times ? "Update paces" : "Set paces"}</Button
        >
        {#if settingTimes}
            <SetTimesForm onCancel={onSettingComplete} onChange={onSettingComplete} />
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

    .times-detail.disabled,
    .times-header.disabled {
        opacity: 0.2;
    }
</style>
