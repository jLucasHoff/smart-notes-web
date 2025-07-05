<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
    import { faGithub } from "@fortawesome/free-brands-svg-icons"

    const GITHUBOAUTHFILE: string = "/login/github";

</script>

<a href={GITHUBOAUTHFILE}>GitHub <FontAwesomeIcon icon={faGithub} /></a>

<style>
    a {
        @media (prefers-color-scheme: dark) {
            background-color: transparent;    
        }

        @media (prefers-color-scheme: light) {
            background-color: var(--github-background-color);
        }

        width: fit-content;

        box-sizing: border-box;
        padding: 5px 15px;
        border-radius: 5px;

        color: var(--github-contrast-color);

        display: flex;
        justify-content: space-between;
        gap: var(--gap-ref);
    }
</style>