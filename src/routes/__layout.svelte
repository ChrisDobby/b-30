<script lang="ts">
    import Button from "@smui/button";
    import Banner, { Label } from "@smui/banner";
    import Header from "$lib/header.svelte";
    import UserHeader from "$lib/userHeader.svelte";
    import UserPanel from "$lib/userPanel.svelte";
    import { onMount } from "svelte";
    import { session } from "$app/stores";

    const SPONSOR_MESSAGE =
        "In April 2022 I am running a half marathon for charity. If you find this app useful please consider sponsoring me.";

    let showBanner = false;
    onMount(() => {
        if ($session.user) {
            const showBannerEndDateStored = localStorage.getItem("showBannerEndDate");
            const showBannerEndDate = showBannerEndDateStored ? new Date(showBannerEndDateStored) : null;
            showBanner = !showBannerEndDate || showBannerEndDate < new Date();
        }
    });

    const handleCloseBanner = () => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        localStorage.setItem("showBannerEndDate", endDate.toISOString());
        showBanner = false;
    };
</script>

<Header />
<div class="banner">
    <Banner bind:open={showBanner} centered mobileStacked>
        <Label slot="label">{SPONSOR_MESSAGE}</Label>
        <svelte:fragment slot="actions">
            <Button primary target="_blank" href="https://www.justgiving.com/chrisdobby" rel="noreferrer"
                >Sponsor me!</Button
            >
            <Button primary on:click={handleCloseBanner}>Close</Button>
        </svelte:fragment>
    </Banner>
</div>
<div class="user-header">
    <UserHeader />
</div>
<main class={!$session.user ? "logged-out" : ""}>
    <div class="user-panel">
        <UserPanel />
    </div>

    <div class="main-slot">
        <slot />
    </div>
</main>
{#if $session.user}
    <footer>
        <p>
            {SPONSOR_MESSAGE}
            <Button
                target="_blank"
                href="https://www.justgiving.com/chrisdobby"
                rel="noreferrer"
                outlined
                color="primary">Sponsor me!</Button
            >
        </p>
    </footer>
{/if}

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

    .logged-out {
        grid-template-columns: 0 1fr;
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
