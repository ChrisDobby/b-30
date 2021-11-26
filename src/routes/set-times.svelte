<script lang="ts">
    import { goto } from "$app/navigation";
    import SetTimesForm from "$lib/setTimesForm.svelte";

    import "../app.scss";

    const onChange = () => goto("/activities");
    const onCancel = () => goto("/activities");
</script>

<SetTimesForm {onChange} {onCancel} />
