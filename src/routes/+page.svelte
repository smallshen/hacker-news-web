<script lang="ts">
    import type { PageData } from "./$types"
    import ItemCard from "$lib/components/ItemCard.svelte"

    export let data: PageData
</script>

<main>
    <ol>
        {#each data.stories as item (item.id)}
            <li>
                <ItemCard {item} />
            </li>
        {/each}

        <li class="pagination">
            {#if data.prevLink}
                <a href={data.prevLink}> Previous </a>
            {/if}
            {#if data.nextLink}
                <a href={data.nextLink}> More </a>
            {/if}
        </li>
    </ol>
</main>

<style>
    main {
        margin: 0 auto;
    }

    ol {
        all: unset;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    li {
        all: unset;
        display: block;
    }

    .pagination {
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--gray8);
        border-radius: 12px;
        background: white;
        padding: 8px 12px 8px 12px;
        margin-bottom: 2rem;
    }

    :global(.dark-theme) .pagination {
        background: color(var(--gray1));
    }

    .pagination a {
        color: var(--gray11);
    }

    .pagination a:hover {
        color: var(--gray12);
    }
</style>
