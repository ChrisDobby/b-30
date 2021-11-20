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
