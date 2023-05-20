import type { PageLoad } from "./$types"
import type { Comment, HackerNewsItems } from "$lib/hacker-news/api-types"
import type { ItemResponse } from "$lib/hacker-news/algolia-types"

export type CommentWithKids = Comment & { kidsData?: Comment[] }

const pageSize = 50

export const load = (async ({ fetch, depends, params, url }) => {

    const itemReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${params.item}.json`)
    const item: HackerNewsItems = await itemReq.json()


    const details: Promise<ItemResponse> = fetch(`https://hn.algolia.com/api/v1/items/${params.item}`, {
        // @ts-ignore
        cf: {
            cacheKey: `hn-item-${params.item}`,
            cacheTtlByStatus: { "200-299": 1, 404: 1, "500-599": 0 }
        }
    })
        .then((res) => res.json())

    depends(`id-${params.item}`)

    return {
        item,
        stream: {
            details
        }
    }
}) satisfies PageLoad
