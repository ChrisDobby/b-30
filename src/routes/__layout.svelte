<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import "../app.scss";
</script>

<TopAppBar variant="static" color={"primary"}>
    <Row>
        <Section>
            <IconButton class="material-icons">menu</IconButton>
            <Title>Breaking 30</Title>
        </Section>
    </Row>
</TopAppBar>
<main>
    <slot />
</main>

<style>
    main {
        padding: 16px;
        height: 100%;
        flex-grow: 1;
        overflow-y: auto;
    }
</style>
