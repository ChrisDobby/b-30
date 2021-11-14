<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import Button from "@smui/button";
</script>

<TopAppBar variant="static" color={"primary"}>
    <Row>
        <Section>
            <IconButton class="material-icons">menu</IconButton>
            <Title>Breaking 30</Title>
        </Section>
        <Section align="end">
            <Button href="/activities" outlined color="primary">Login</Button>
        </Section>
    </Row>
</TopAppBar>
