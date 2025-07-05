<script>
    import GitHubOAuth from "$lib/components/buttons/gitHubOAuth.svelte";

</script>
<section>
    <div>

    </div>
    <div>
        <h2>O melhor aplicativo de notas para estudos do mundo. De graça para sempre. Guardado em seu github.</h2>
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
