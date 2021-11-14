<script context="module">
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({ session }) {
        return { props: { user: session.user } };
    }
</script>

<script lang="ts">
    import "../app.scss";
</script>

<div class="coming-soon">
    <h4>Coming soon!</h4>
</div>

<style>
    .coming-soon {
        text-align: center;
    }
</style>
