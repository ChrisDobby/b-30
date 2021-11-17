<script context="module">
    import { secure } from "$lib/authentication";
    export const load = secure(() => {
        return {};
    });
</script>

<script lang="ts">
    import "../app.scss";
</script>
