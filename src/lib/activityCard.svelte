<script lang="ts">
    import type { StravaActivity } from "$lib/types";
    import Card, { Content } from "@smui/card";

    export let activity: StravaActivity;
</script>

<li class="card-container">
    <Card
        ><Content
            ><div class="activity-name">{activity.name}</div>
            <div class="activity-date">{activity.date}</div>
        </Content></Card
    >
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
</style>
