<script lang="ts">
    import type { Times } from "$lib/types";
    import { timeFromSeconds, calculateSpeedAndPace } from "$lib/utils";

    export let times: Times;
</script>

<p>
    {`Date 5k time: ${timeFromSeconds(times.date5k)} at ${calculateSpeedAndPace(5000 / times.date5k)[1]}`}
</p>
