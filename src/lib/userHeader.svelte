<script lang="ts">
    import type { User, Times } from "./types";
    import { session } from "$app/stores";
    import { timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";
    import PaceGrid from "$lib/paceGrid.svelte";

    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    const user = $session.user as User;
    let times = $session.times as Times;
    session.subscribe(update => {
        times = update.times;
    });

    let showingPaces = false;
</script>

{#if user}
    <button class="user-header" on:click={() => (showingPaces = !showingPaces)}>
        <img src={user.profile} />
        <div class="header">
            <div class="user-name">{`${user.firstName} ${user.lastName}`}</div>
        </div>
        <div class="times-header">
            {#if times}
                <div class="five-k-description">
                    {`Date 5k time: ${timeFromSeconds(times.date5k)} at ${getSpeedAndPace(5000 / times.date5k)[1]}`}
                </div>
                <i class={showingPaces ? "up-arrow" : "down-arrow"} />
            {:else if $session.timesError}
                <p class="small">Something went wrong getting your paces. Please refresh to try again.</p>
            {:else}
                <p class="small">You have no paces set</p>
            {/if}
        </div>
        {#if showingPaces && times}
            <div class="times-detail">
                <PaceGrid {times} measurementPreference={$session.measurementPreference} />
            </div>
        {/if}
    </button>
{/if}

<style>
    .user-header {
        background-color: var(--mdc-theme-secondary, #5d5d78);
        padding: 0.5em 1em 0.5em 1em;
        display: grid;
        grid-template-columns: max-content 1fr;
        outline: none;
        border: none;
        font-size: 1em;
        text-align: left;
        color: var(--mdc-theme-on-secondary, #fff);
        cursor: pointer;
        width: 100%;
    }

    .user-header .header {
        display: flex;
        align-items: center;
        grid-column: 2;
        grid-row: 1;
    }

    .user-header img {
        width: 3em;
        height: 3em;
        border-radius: 50%;
        margin-right: 1em;
        grid-column: 1;
        grid-row: 1 / 3;
    }
    .user-name {
        color: var(--mdc-theme-on-secondary, #fff);
        font-size: 1.2em;
    }

    .times-header {
        font-size: 0.75em;
        grid-column: 2;
        grid-row: 2;
        display: flex;
    }

    .times-detail {
        font-size: 0.75em;
        grid-column: 2;
        grid-row: 3;
    }

    .times-header p {
        margin: 0;
    }

    .up-arrow {
        width: 0;
        height: 0;
        border-width: 0 11.5px 13px 11.5px;
        border-color: transparent transparent #fff transparent;
        border-style: solid;
    }

    .down-arrow {
        width: 0;
        height: 0;
        border-width: 13px 11.5px 0 11.5px;
        border-color: #fff transparent transparent transparent;
        border-style: solid;
    }

    .five-k-description {
        flex: 1;
    }
</style>
