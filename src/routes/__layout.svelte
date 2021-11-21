<script lang="ts">
    import Button from "@smui/button";
    import Header from "$lib/header.svelte";
    import UserPanel from "$lib/userPanel.svelte";
</script>

<Header />
<UserPanel />
<main>
    <slot />
</main>
<footer>
    <p>
        In April 2022 I am running a half marathon for charity. If you find this app useful please consider sponsoring
        me.
        <Button target="_blank" href="https://www.justgiving.com/chrisdobby" outlined color="primary"
            >Sponsor me!</Button
        >
    </p>
</footer>

<style>
    main {
        padding: 16px;
        height: 100%;
        flex-grow: 1;
        overflow-y: auto;
    }

    footer {
        padding: 4px;
        padding-bottom: 16px;
        text-align: center;
        background-color: var(--mdc-theme-surface, #212125);
    }
</style>
