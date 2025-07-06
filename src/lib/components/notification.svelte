<script lang="ts">
    import type { INotification } from "$lib/notifications";
    import { fade } from "svelte/transition";

    let { notification }: { notification: INotification } = $props();
    let notification_element:HTMLDivElement
</script>

<div id="notification__space" bind:this={notification_element} in:fade out:fade>
    <div id="notification__content">
        <p>{notification.message}</p>
    </div>
</div>

<style>
    #notification__space {
        display: flex;
        justify-content: center;
        align-items: center;

        max-width: 35vw;
        max-height: 10vh;

        & #notification__content {
            display: flex;

            background: var(--background-contrast-color);

            color: var(--text-contrast-color);

            box-sizing: border-box;
            padding: 15px;
            border-radius: 15px;
        }
    }
</style>