<script lang="ts">
    import type { User, Times, Session } from "./types";
    import { session } from "$app/stores";
    import { timeFromSeconds, calculateSpeedAndPace, getPacesForDateTime } from "$lib/utils";
    import PaceGrid from "$lib/paceGrid.svelte";
    import { slide } from "svelte/transition";

    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    const user = $session.user as User;
    let currentPaces = getPacesForDateTime(new Date(), $session.times as Times[] | null);
    session.subscribe((update: Session) => {
        currentPaces = getPacesForDateTime(update.pacesDate || new Date(), update.times);
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
            {#if currentPaces}
                <div class="five-k-description">
                    {`Date 5k time: ${timeFromSeconds(currentPaces.date5k)} at ${
                        getSpeedAndPace(5000 / currentPaces.date5k)[1]
                    }`}
                </div>
                <i class={showingPaces ? "up-arrow" : "down-arrow"} />
            {:else if $session.timesError}
                <p class="small">Something went wrong getting your paces. Please refresh to try again.</p>
            {:else}
                <p class="small">You have no paces set</p>
            {/if}
        </div>
        {#if showingPaces && currentPaces}
            <div class="times-detail" transition:slide>
                <PaceGrid paces={currentPaces} measurementPreference={$session.measurementPreference} />
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
