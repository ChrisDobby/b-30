<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import Button from "@smui/button";
    import { session } from "$app/stores";
</script>

<TopAppBar variant="static" color={"primary"}>
    <Row>
        <Section>
            <IconButton class="material-icons">menu</IconButton>
            <Title>Breaking 30</Title>
        </Section>
        <Section align="end">
            {#if $session.user}
                <Button href="/api/logout" rel="external" outlined color="primary">Logout</Button>
            {:else}
                <Button href="/activities" outlined color="primary">Login</Button>
            {/if}
        </Section>
    </Row>
</TopAppBar>
