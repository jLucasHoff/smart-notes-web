<script lang="ts">
    import { notifications } from "$lib/notifications";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faTrashCan} from "@fortawesome/free-solid-svg-icons";
    import Notification from "./notification.svelte";
</script>

<div>
    <button type="button" onclick={notifications.clearAll}>
        <FontAwesomeIcon icon={faTrashCan} />
    </button>
    {#each $notifications as notification}
        <Notification {notification} />
    {/each}
</div>

<style>
    div {
        position: fixed;
        bottom: 25px;
        right: 25px;
        z-index: 99;

        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 15px;

        & button {
            display: flex;
            align-items: center;

            box-sizing: border-box;
            padding: 15px;
            border-radius: 15px;

            background: var(--background-contrast-color);
            
            color: var(--text-contrast-color);
        }
    }
</style>