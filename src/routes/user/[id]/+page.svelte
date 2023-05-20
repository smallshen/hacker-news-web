<script lang="ts">
    import type { PageData } from "./$types"
    import HackerNewsText from "$lib/components/HackerNewsText.svelte"

    export let data: PageData
</script>

<main>
    <h1 class="headline5" property="user">{data.user.id}</h1>
    <table class="body1">
        <tr>
            <th>Created:</th>
            <td>{data.user.created}</td>
        </tr>
        <tr>
            <th>Karma:</th>
            <td>{data.user.karma}</td>
        </tr>
        {#if data.user.about}
            <tr>
                <th>About:</th>
                <td>
                    <HackerNewsText s={data.user.about} />
                </td>
            </tr>
        {/if}

        {#if data.user.submitted}
            <tr>
                <th />
                <td>
                    <a href="/user/{data.user.id}/submissions">submissions</a>
                </td>
            </tr>
        {/if}
    </table>
</main>

<style>
    main {
        margin: 0 auto;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        margin-top: 1rem;
    }

    td {
        width: 100%;
    }
</style>
