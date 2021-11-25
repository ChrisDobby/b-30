<script lang="ts">
    import Button from "@smui/button";
    import Banner, { Label } from "@smui/banner";
    import Header from "$lib/header.svelte";
    import UserHeader from "$lib/userHeader.svelte";
    import UserPanel from "$lib/userPanel.svelte";

    const SPONSOR_MESSAGE =
        "In April 2022 I am running a half marathon for charity. If you find this app useful please consider sponsoring me.";
    let showingBanner = true;
</script>

<Header />
<div class="banner">
    <Banner bind:open={showingBanner} centered mobileStacked>
        <Label slot="label">{SPONSOR_MESSAGE}</Label>
        <Button slot="actions" primary target="_blank" href="https://www.justgiving.com/chrisdobby">Sponsor me!</Button>
    </Banner>
</div>
<div class="user-header">
    <UserHeader />
</div>
<main>
    <div class="user-panel">
        <UserPanel />
    </div>
    <div class="main-slot">
        <slot />
    </div>
</main>
<footer>
    <p>
        {SPONSOR_MESSAGE}
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
        overflow-y: hidden;
        display: grid;
        grid-template-columns: 40% 1fr;
        column-gap: 1em;
        max-width: 1300px;
        width: calc(100vw - 16px);
        margin-left: auto;
        margin-right: auto;
    }

    footer {
        display: none;
        padding: 4px;
        padding-bottom: 16px;
        text-align: center;
        background-color: var(--mdc-theme-surface, #212125);
    }

    .user-panel {
        display: none;
    }
    .main-slot {
        grid-column: 1 / 3;
        height: 100%;
        overflow-y: hidden;
    }
    @media (min-width: 1000px) {
        .main-slot {
            grid-column: 2;
        }
        .user-header {
            display: none;
        }

        .user-panel {
            display: block;
            grid-column: 1;
            height: 100%;
            overflow: hidden;
        }

        footer {
            display: block;
        }

        .banner {
            display: none;
        }
    }
</style>
