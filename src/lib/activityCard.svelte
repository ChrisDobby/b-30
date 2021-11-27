<script lang="ts">
    import type { StravaActivity } from "$lib/types";
    import Card, { Content, Actions, ActionButtons } from "@smui/card";
    import Button from "@smui/button";
    import { fade } from "svelte/transition";

    export let activity: StravaActivity;
    export let disabled: boolean;
    export let onSetTimes: () => void;
</script>

<li class="card-container" in:fade>
    <Card
        ><Content
            ><div class="activity-name">{activity.name}</div>
            <div class="activity-date">{activity.date}</div>
            <div class="activity-data">{`Distance: ${activity.distance}`}</div>
            <div class="activity-data">{`Time: ${activity.time}`}</div>
            <div class="activity-data">{`Pace: ${activity.pace}`}</div>
        </Content>
        <Actions>
            <ActionButtons>
                <Button on:click={onSetTimes} {disabled}>Set times</Button>
                <Button
                    href={`https://www.strava.com/activities/${activity.id}`}
                    target="_blank"
                    rel="noreferrer"
                    {disabled}>View in Strava</Button
                >
            </ActionButtons>
        </Actions>
    </Card>
</li>

<style>
    .card-container {
        margin-bottom: 2rem;
    }

    .activity-name {
        font-size: 1.2rem;
        font-weight: bold;
    }

    .activity-date {
        font-size: 0.8rem;
        color: #999;
    }

    .activity-data {
        font-size: 0.9rem;
    }
</style>
