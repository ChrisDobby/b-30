<script lang="ts">
    import type { User, Times } from "./types";
    import { session } from "$app/stores";
    import TimesPanel from "$lib/timesPanel.svelte";

    const user = $session.user as User;
    let times = $session.times as Times;
    session.subscribe(update => {
        times = update.times;
    });
</script>

{#if user}
    <div class="user-panel">
        <img src={user.profile} />
        <div class="header">
            <div class="user-name">{`${user.firstName} ${user.lastName}`}</div>
        </div>
        <div class="times">
            {#if times}<TimesPanel {times} />
            {:else}
                <p class="small">You have no paces set</p>
            {/if}
        </div>
    </div>
{/if}

<style>
    .user-panel {
        background-color: var(--mdc-theme-secondary, #5d5d78);
        padding: 0.5em 1em 0.5em 1em;
        display: grid;
        grid-template-columns: max-content 1fr;
    }

    .user-panel .header {
        display: flex;
        align-items: center;
        grid-column: 2;
        grid-row: 1;
    }

    .user-panel img {
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

    .times {
        font-size: 0.75em;
        grid-column: 2;
        grid-row: 2;
    }

    .times p {
        margin: 0;
    }
</style>
