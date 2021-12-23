<script lang="ts">
    import type { DisplayActivity } from "$lib/types";
    import { distance, timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";
    import { session } from "$app/stores";
    import ActivityCharts from "$lib/activityCharts.svelte";
    import LapChart from "$lib/lapChart.svelte";
    import LapSelect from "$lib/lapSelect.svelte";
    import Paper, { Content } from "@smui/paper";
    import Drawer, { Content as DrawerContent, Header, Title, DrawerComponentDev } from "@smui/drawer";
    import ChartKey from "$lib/chartKey.svelte";
    import Button, { ButtonComponentDev } from "@smui/button";
    import { onMount } from "svelte";

    const getDistance = distance($session.measurementPreference);
    const getSpeedAndPace = calculateSpeedAndPace($session.measurementPreference);

    export let activity: DisplayActivity;
    export let notCurrentPaces = false;
    let showingKey = false;
    let showKeyButton: ButtonComponentDev;
    let drawer: DrawerComponentDev;

    const handleMouseDown = e => {
        if (!showingKey) {
            return;
        }

        const buttonElement = showKeyButton.getElement();
        const drawerElement = drawer.getElement();
        if (
            e.target !== buttonElement &&
            !buttonElement.contains(e.target) &&
            e.target !== drawerElement &&
            !drawerElement.contains(e.target)
        ) {
            showingKey = false;
        }
    };

    onMount(() => {
        document.addEventListener("mousedown", handleMouseDown);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    });
</script>

<Drawer bind:this={drawer} variant="dismissible" fixed={false} bind:open={showingKey}>
    <Header>
        <Title>Chart key</Title>
    </Header>
    <DrawerContent>
        <div class="drawer-content">
            <ChartKey />
            <Button
                on:click={() => (showingKey = false)}
                style="display:block; margin-left:auto; margin-right:auto; margin-top:2em">Close</Button
            >
        </div></DrawerContent
    >
</Drawer>

<div class="activity">
    {#if activity && notCurrentPaces}
        <div class="warning">
            <Paper color="primary" style="padding: 0.85rem">
                <Content style="font-size: 0.85rem; line-height: 1.25">
                    This display is using paces from the date of the activity which are different to your current paces.</Content
                >
            </Paper>
        </div>
    {/if}

    <div>
        <h2 class="activity-name">{activity.name}</h2>
        <p class="activity-detail">{activity.dateTime}</p>
        <p class="activity-detail">
            {`${getDistance(activity.distance)} in ${timeFromSeconds(activity.movingTime)} at ${
                getSpeedAndPace(activity.averageSpeed)[1]
            }`}
        </p>
    </div>
    <div class="show-key-button">
        <Button bind:this={showKeyButton} on:click={() => (showingKey = !showingKey)}>Show key</Button>
    </div>
    <div class="activity-view">
        <div class="inline-key">
            <ChartKey />
        </div>
        <div class="activity-data">
            <ActivityCharts analysis={activity.analysis} />
            <LapChart laps={activity.analysis.laps} />
            <hr />
            <LapSelect {activity} />
        </div>
    </div>
</div>

<style>
    .activity {
        text-align: center;
        padding-right: 16px;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: hidden;
    }

    .activity-name {
        margin: 0;
        font-size: 2em;
    }

    .activity-detail {
        margin: 0;
        font-size: 1em;
    }

    .activity-view {
        flex: 1;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        display: flex;
    }
    .activity-data {
        padding: 1em;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        row-gap: 1em;
        align-items: center;
    }

    .warning {
        margin-right: 16px;
    }

    hr {
        width: 100%;
        color: var(--mdc-theme-on-secondary, #fff);
    }

    .drawer-content {
        padding: 1em;
    }

    .inline-key {
        display: none;
    }
    @media (min-width: 600px) {
        .show-key-button {
            display: none;
        }

        .inline-key {
            display: block;
        }
    }
</style>
