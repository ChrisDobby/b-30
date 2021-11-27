<script context="module" lang="ts">
    import { securePage } from "$lib/authentication";
    import { getActivities } from "$lib/utils";
    import resilientFetch from "$lib/resilientFetch";

    export const load = securePage(async ({ session, fetch }) => {
        const f = resilientFetch(fetch);
        const activitiesResult = await getActivities(f, session.token, session.measurementPreference, 1);
        if (activitiesResult.result === ApiResult.Error) {
            return { props: { activities: [], loadingError: activitiesResult.error } };
        }

        return { props: { activities: activitiesResult.activities, loadingError: "" } };
    });
</script>

<script lang="ts">
    import { ApiResult, StravaActivity } from "$lib/types";
    import ActivityCard from "$lib/activityCard.svelte";
    import Snackbar, { Label, SnackbarComponentDev } from "@smui/snackbar";
    import Paper, { Title, Content } from "@smui/paper";
    import { session } from "$app/stores";
    import "../app.scss";

    export let activities: StravaActivity[] = [];
    export let loadingError = "";

    let errorSnackbar: SnackbarComponentDev;

    let settingTimes: boolean;
    const f = resilientFetch(fetch);

    const handleSetTimes = (activity: StravaActivity) => async () => {
        settingTimes = true;
        try {
            const response = await f(`/api/setTimes/${activity.id}`, { method: "POST" });
            if (!response.ok) {
                errorSnackbar.open();
            } else {
                const times = await response.json();
                $session.times = times;
            }
        } catch (e) {
            errorSnackbar.open();
        } finally {
            settingTimes = false;
        }
    };

    let loadingPage = false;
    let currentPage = 1;
    let canLoadMore = true;
    async function onScroll(args) {
        if (loadingPage || !canLoadMore) {
            return;
        }

        const atBottom = args.target.scrollTop === args.target.scrollHeight - args.target.offsetHeight - 5;
        if (!atBottom) {
            return;
        }

        loadingPage = true;
        loadingError = "";
        try {
            const getActivitiesResult = await getActivities(
                fetch,
                $session.token,
                $session.measurementPreference,
                currentPage + 1,
            );

            if (getActivitiesResult.result === ApiResult.Error) {
                canLoadMore = false;
                loadingError = getActivitiesResult.error;
                return;
            }

            const activitiesInNewPage = getActivitiesResult.activities;
            canLoadMore = activitiesInNewPage.length > 0;
            activities = [...activities, ...activitiesInNewPage];
        } finally {
            currentPage += 1;
            loadingPage = false;
        }
    }
</script>

<svelte:head>
    <title>Actvities for {$session.user.firstName} {$session.user.lastName}</title>
</svelte:head>

{#if loadingError}
    <div class="loading-error">
        <Paper color="primary"
            ><Title>Loading error</Title>
            <Content>Something went wrong loading your activities from Strava. Please try again.</Content></Paper
        >
    </div>
{/if}

{#if activities.length}
    <ul class="card-display" on:scroll={onScroll}>
        {#each activities as activity}
            <ActivityCard {activity} disabled={settingTimes} onSetTimes={handleSetTimes(activity)} />
        {/each}
    </ul>
{/if}

<Snackbar bind:this={errorSnackbar}><Label>Something went wrong setting the times. Please try again.</Label></Snackbar>

<style>
    .card-display {
        margin: 0;
        list-style-type: none;
        padding-left: 0;
        padding-right: 16px;
        height: 100%;
        overflow-y: auto;
    }

    .loading-error {
        margin-right: 16px;
    }
</style>
