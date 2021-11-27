<script lang="ts">
    import { goto } from "$app/navigation";
    import SetTimesForm from "$lib/setTimesForm.svelte";
    import { session } from "$app/stores";

    import "../app.scss";

    const onChange = () => goto("/activities");
    const onCancel = () => goto("/activities");
</script>

<svelte:head>
    <title>Set pace for {$session.user.firstName} {$session.user.lastName}</title>
</svelte:head>

<SetTimesForm {onChange} {onCancel} />
