<script context="module">
    export function load({ error, status }) {
        return {
            props: {
                error: `${status}: ${error.message}`,
            },
        };
    }
</script>

<script>
    import Button from "@smui/button";

    export let error;
</script>

<div style="text-align: center; margin-right: 16px">
    <h3>Oops!</h3>
    <h5>Something went wrong with the app</h5>
    <p>Probably best if you go back to the home page and have another go</p>
    <Button href="/">Go home</Button>
    <p>If you're interested the error reported was:</p>
    <pre>{error}</pre>
</div>
