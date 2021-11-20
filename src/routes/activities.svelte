<script context="module" lang="ts">
    import { secure } from "$lib/authentication";
    export const load = secure(async ({ session, fetch }) => {
        const activitiesResponse = await fetch("https://www.strava.com/api/v3/athlete/activities", {
            headers: { Authorization: `Bearer ${session.token}` },
        });
        return { props: { activities: await activitiesResponse.json() } };
    });
</script>

<script lang="ts">
    import type { StravaActivity } from "$lib/types";
    import "../app.scss";

    export let activities: StravaActivity[];
</script>

<ul>
    {#each activities as activity}
        <li><span>{`${activity.name} - ${activity.start_date}`}</span></li>
    {/each}
</ul>
