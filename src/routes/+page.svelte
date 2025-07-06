<script lang="ts">
    import GitHubOAuth from "$lib/components/buttons/gitHubOAuth.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    $: {
        if (data.user) {
            console.log("usuário logado: ", data.user.name);
        }
    }

</script>
<section>
    <div>

    </div>
    <div>
        <h2>O melhor aplicativo de anotação em notas do mundo. De graça para sempre. Guardado em seu github.</h2>
        <p>Logue com sua conta do GitHub para utilizar o SmartNotes</p>
        <GitHubOAuth />
    </div>
</section>

<style>
    section {
        flex: 1;
        display: flex;
        gap: calc(var(--gap-ref) * 2);

        & > div {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: var(--gap-ref);

            & h2 {
                font-size: 2.75rem;
                font-weight: normal;
            }
        }
    }
</style>
