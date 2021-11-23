<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import Button from "@smui/button";
    import Menu, { MenuComponentDev } from "@smui/menu";
    import List, { Item, Separator, Text } from "@smui/list";
    import { session } from "$app/stores";

    let menu: MenuComponentDev;
</script>

<TopAppBar variant="static" color={"primary"}>
    <Row>
        <Section>
            <IconButton on:click={() => menu.setOpen(true)} class="material-icons">menu</IconButton>
            <Menu bind:this={menu}>
                <List>
                    {#if $session.user}
                        <Item>
                            <Button href="/set-times">
                                <Text>Set paces</Text>
                            </Button>
                        </Item>
                        <Separator />
                        <Item>
                            <Button href="/api/logout" rel="external">
                                <Text>Logout</Text>
                            </Button>
                        </Item>
                    {:else}
                        <Item>
                            <Button href="/activities">
                                <Text>Login</Text>
                            </Button>
                        </Item>
                    {/if}
                </List>
            </Menu>
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
