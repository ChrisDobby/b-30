<script lang="ts">
    import type { User } from "./types";
    import { session } from "$app/stores";

    const user = $session.user as User;
</script>

{#if user}
    <div class="user-panel">
        <div class="header">
            <img src={user.profile} alt="user picture" />
            <div class="user-name">{`${user.firstName} ${user.lastName}`}</div>
        </div>
    </div>
{/if}

<style>
    .user-panel {
        background-color: var(--mdc-theme-secondary, #5d5d78);
        padding: 0.5em 1em 0.5em 1em;
    }

    .user-panel .header {
        display: flex;
        align-items: center;
    }

    .user-panel .header img {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        margin-right: 1em;
    }
    .user-name {
        color: var(--mdc-theme-on-secondary, #fff);
        font-size: 1.2em;
    }
</style>
