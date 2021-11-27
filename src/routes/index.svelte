<script context="module" lang="ts">
    export const load = async ({ session }) => {
        if (session.user) {
            return {
                status: 302,
                redirect: "/activities",
            };
        }

        return {};
    };
</script>

<script lang="ts">
    import Button from "@smui/button";

    import "../app.scss";
</script>

<svelte:head>
    <title>Breaking 30</title>
    <meta
        name="description"
        content="Analyse your Strava runs based on the Brightside PCT breaking 30 mastery program"
    />
</svelte:head>
<div class="home-page">
    <h5>Analyse your Strava runs based on the</h5>
    <h5 class="brightside-link">
        <a href="https://www.brightsidept.com/breaking-30-5k-mastery" target="_blank" rel="noreferrer"
            >Brightside PT breaking 30 for 5k program
        </a>
    </h5>
    <p>To use the application you must login to your Strava account</p>
    <Button href="/activities">Login to Strava</Button>
    <p class="source">If you're interested the source code for this application can be found here</p>
    <a href="https://github.com/chrisdobby/b-30" target="_blank" rel="noreferrer">https://github.com/chrisdobby/b-30</a>
</div>

<style>
    .home-page {
        text-align: center;
        padding-right: 16px;
    }

    .brightside-link {
        margin-top: -1em;
    }

    .source {
        margin-top: 4em;
    }
</style>
