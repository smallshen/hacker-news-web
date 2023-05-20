<script lang="ts">
    import { dateDiff } from "$lib/daysDiff"
    import type { CommentWithKids } from "./+page"
    import HackerNewsText from "$lib/components/HackerNewsText.svelte"
    import type { ItemResponse } from "$lib/hacker-news/algolia-types"

    export let comment: ItemResponse

    $: timeDiffText = dateDiff(comment.created_at_i! * 1000)
</script>

<div class="card" id={comment.id}>
    <div class="meta-info body2">
        <a href="/user/{comment.author}">
            <p>
                <span property="author">{comment.author}</span>
            </p>
        </a>

        <p>
            {timeDiffText}
        </p>
    </div>

    <HackerNewsText s={comment.text} />
</div>

{#if comment.children}
    <ol>
        {#each comment.children as child (child.id)}
            {#if child.author}
                <li>
                    <svelte:self comment={child} />
                </li>
            {/if}
        {/each}
    </ol>
{/if}

<style>
    .card {
        border-radius: 12px;
        border: 1px solid var(--gray8);
        padding: 4px 12px;
        overflow: hidden;

        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }

    .meta-info {
        display: flex;
        flex-direction: row;
        gap: 0.8rem;
        flex-wrap: wrap;
        color: var(--gray11);
    }

    a {
        all: unset;
        display: block;
        cursor: pointer;
    }

    a:is(:hover, :focus) {
        text-decoration: underline;
    }

    ol {
        all: unset;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-left: 1px solid var(--gray6);
        box-sizing: border-box;
        padding-left: 16px;
        margin-top: 8px;
    }

    li {
        all: unset;
        display: block;
    }
</style>
