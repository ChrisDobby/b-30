<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import Button from "@smui/button";
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
<footer>
    <p>
        In April 2022 I am running a half marathon for charity. If you find this app useful please consider sponsoring
        me.
        <Button target="_blank" href="https://www.justgiving.com/chrisdobby" outlined color={"primary"}
            >Sponsor me!</Button
        >
    </p>
</footer>

<style>
    main {
        padding: 16px;
        height: 100%;
        flex-grow: 1;
        overflow-y: auto;
    }

    footer {
        padding: 4px;
        text-align: center;
        background-color: var(--mdc-theme-surface, #212125);
    }
</style>
