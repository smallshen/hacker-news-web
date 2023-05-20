<script lang="ts">
    import type { PageData } from "./$types"
    import { dateDiff } from "$lib/daysDiff"
    import CommentCard from "./CommentCard.svelte"
    import HackerNewsText from "$lib/components/HackerNewsText.svelte"
    import ItemTag from "$lib/components/ItemTag.svelte"

    export let data: PageData

    $: item = data.item
    $: possibleTitle =
        (item.type !== "comment" && item.type !== "pollopt" ? item.title : item.url) || item.text?.slice(0, 100) + "..."
    $: timeAgo = item.created_at_i ? dateDiff(item.created_at_i * 1000) : undefined

    $: points = item.score || item.descendants
</script>

<svelte:head>
    <title>{possibleTitle || "Hacker News"} | Hacker News</title>
</svelte:head>

<main>
    <article style:--tag="item-{item.id}">
        <div class="main-info transition-box">
            {#if item.url}
                <a class="link" href={item.url} target="_blank">
                    <h1 class="subtitle1 title" property="name headline title">{possibleTitle }</h1>
                </a>
            {:else}
                <h1 class="subtitle1 title" property="name headline title">
                    {#if item.type === "comment"}
                        {@html item.text}
                    {:else}
                        {possibleTitle}
                    {/if}
                </h1>
            {/if}

            <div class="main-info-meta body1">
                {#if points}
                    <p class="body1">
                        <span property="point">{points} points</span>
                    </p>
                {/if}

                <p>
                    by
                    <a href="/user/{item.by || item.author}">
                        <span property="author">{item.by || item.author}</span>
                    </a>
                </p>

                <p>
                    <span property="datePublished">{timeAgo}</span>
                </p>

                {#if item.descendants}
                    <p>
                        <span property="interactionCount">{item.descendants}</span>
                        comments
                    </p>
                {/if}

                <ItemTag type={item.type} />
            </div>
        </div>
    </article>

    <div class="divider" />

    {#if item.text}
        <HackerNewsText s={item.text} />
    {/if}

    <ul>
        {#each data.item.children as child (child.id)}
            {#if child.author}
                <li>
                    <CommentCard comment={child} />
                </li>
            {/if}
        {/each}

        <!--{#if data.prevLink || data.nextLink}-->
        <!--    <li class="pagination">-->
        <!--        {#if data.prevLink}-->
        <!--            <a href={data.prevLink}> Previous </a>-->
        <!--        {/if}-->
        <!--        {#if data.nextLink}-->
        <!--            <a href={data.nextLink}> More </a>-->
        <!--        {/if}-->
        <!--    </li>-->
        <!--{/if}-->
    </ul>
</main>

<slot />

<style>
    main {
        max-width: 1200px;
        padding: 0 8px;
        margin: 0 auto;
    }

    .transition-box {
        view-transition-name: var(--tag);
    }

    .link {
        color: var(--gray12);
        text-decoration: none;
    }

    .link:is(:hover, :focus) {
        text-decoration: underline;
    }

    .link:visited {
        color: var(--gray11);
    }

    .main-info {
        display: flex;
        flex-direction: column;
    }

    .main-info-meta {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        color: var(--gray11);
    }

    /* add '|' after each p in main-info-meta */
    .main-info-meta p:not(:last-of-type)::after {
        content: "|";
        margin-left: 8px;
        color: var(--gray8);
        font-family: var(--font-medium);
        font-weight: bolder;
    }

    .divider {
        height: 1px;
        background-color: var(--gray8);
        margin: 16px 0;
    }

    ul {
        all: unset;
        display: flex;
        flex-direction: column;
        gap: 2rem;
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
