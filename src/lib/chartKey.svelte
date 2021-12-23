<script lang="ts">
    import { CHART_DISPLAY } from "./utils";

    const keys = Object.values(CHART_DISPLAY).map(value => ({
        text: value.isPrimaryPace ? value.label : "",
        colour: value.colour,
        class: value.isPrimaryPace ? "indicator primary" : "indicator secondary",
    }));
</script>

<div class="key-container">
    {#each keys as key}
        <span>{key.text}</span>
        <span style={`background-color: ${key.colour}`} class={key.class} />
    {/each}
</div>

<style>
    .key-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 0.5em;
        align-items: center;
        text-align: left;
    }

    .indicator {
        width: 2rem;
        border-radius: 2px;
    }

    .indicator.primary {
        height: 1em;
    }

    .indicator.secondary {
        height: 0.5em;
    }
</style>
