<script lang="ts">
    import type { HackerNewsItems } from "$lib/hacker-news/api-types"
    import { dateDiff } from "$lib/daysDiff"
    import ItemTag from "$lib/components/ItemTag.svelte"

    export let item: HackerNewsItems & {
        title?: string
        url?: string
        score?: number
        descendants?: number
        __semCount: number // count of hot items
    }

    $: possibleTitle =
        (item.type !== "comment" && item.type !== "pollopt" ? item.title : item.url) || item.text?.slice(0, 100) + "..."
    $: timeAgo = item.time ? dateDiff(item.time * 1000) : undefined

    function removeWWW(url: string) {
        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
    }
</script>

<a href="/item/{item.type === 'comment' ? item.parent : item.id}" class="card">
    <article class="card-content" style:--tag="item-{item.id}">
        <h1 class="subtitle3 title">
            {item.__semCount}.
            <span property="title">
                {#if item.type === "comment"}
                    {@html item.text}
                {:else}
                    {possibleTitle || "No title"}
                {/if}
            </span>
        </h1>
        <div class="mid-bar">
            <a href="/user/{item.by}" class="body1 user-link" property="author">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                    />
                </svg>
                {item.by}
            </a>

            <span class="body1">
                {timeAgo}
            </span>

            {#if item.url}
                {@const url = new URL(item.url)}
                <a href={item.url} class="body1 link" property="url" target="_blank">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                        />
                    </svg>
                    {removeWWW(url.origin)}
                </a>
            {/if}
        </div>
        <div class="divider" />
        <div class="bot-bar">
            <div class="meta-info">
                {#if item.score}
                    <p class="body2">
                        <span property="points">{item.score}</span>&nbsp;points
                    </p>
                {/if}

                {#if item.descendants}
                    <p class="body2">
                        <span property="comments">{item.descendants}</span>&nbsp;comments
                    </p>
                {/if}
            </div>

            <ItemTag type={item.type} />
        </div>
    </article>
</a>

<style>
    .card {
        display: block;
        background: white;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border: 1px solid var(--gray6);
        border-radius: 12px;

        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        will-change: border-color, box-shadow;
    }

    .card:is(:hover, :focus) {
        border-color: var(--gray7);
    }

    .card:active {
        border-color: var(--gray8);
    }

    .card:is(:hover, :focus, :active) {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .card-content {
        display: flex;
        flex-direction: column;
        cursor: pointer;

        view-transition-name: var(--tag);

        padding: 8px 12px 8px 12px;
    }

    :global(.dark-theme) .card {
        background: var(--gray1);
    }

    .divider {
        height: 1px;
        background-color: var(--gray6);
        margin-top: 8px;
        margin-bottom: 8px;
    }

    .mid-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--gray11);
        flex-wrap: wrap;
    }

    .bot-bar {
        display: flex;
        color: var(--gray11);
        flex-wrap: wrap;
    }

    a {
        all: unset;
        display: block;
        text-decoration: none;
    }

    .link {
        color: var(--tomato11);
    }

    .link:is(:hover, :focus, :active),
    .user-link:is(:hover, :focus, :active) {
        text-decoration: underline;
    }

    .user-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        gap: 6px;
        color: var(--gray11);
    }

    .link {
        display: flex;
        align-items: center;
        text-decoration: none;
        gap: 6px;
    }

    .meta-info {
        display: flex;
        color: var(--gray11);
        gap: 8px;
        flex-wrap: wrap;
    }
</style>
