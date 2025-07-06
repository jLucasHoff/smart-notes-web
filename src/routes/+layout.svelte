<script lang="ts">
    import Navbar from "$lib/components/navbar.svelte";
    import NotificationRegistry from "$lib/components/notificationRegistry.svelte";
    import "$lib/styles/app.css";
    import { onMount } from "svelte";
    import type { LayoutProps } from "./$types";
    import { notifications } from "$lib/notifications";

    let { data, children }: LayoutProps = $props();

    onMount(() => {
        if (data.serverMessage) {
            notifications.addNotification(data.serverMessage)
        }
    })
</script>

<main>
    <NotificationRegistry />
    <Navbar />
    {@render children?.()}
</main>