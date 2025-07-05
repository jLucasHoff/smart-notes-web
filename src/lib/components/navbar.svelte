<nav>
    <h1><span>SmartNotes</span></h1>
</nav>

<style>
    nav {
        width: 100%;

        display: flex;

        & h1 {
            font-size: 1.25rem;

            &:first-child:not(:has(~ *)) {
                margin: 0 auto;
            }
        }
    }
</style>