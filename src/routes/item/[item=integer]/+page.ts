import type { PageLoad } from "./$types"
import type { Comment, HackerNewsItems } from "$lib/hacker-news/api-types"
import { sanitizeItem } from "$lib/hacker-news/api-types"
import { hasMore } from "$lib/pagination/hasMore"
import type { ItemResponse } from "$lib/hacker-news/algolia-types"

export type CommentWithKids = Comment & { kidsData?: Comment[] }

const pageSize = 50

export const load = (async ({ fetch, depends, params, url }) => {
    const itemReq = await fetch(`https://hn.algolia.com/api/v1/items/${params.item}`)
    const item: ItemResponse = await itemReq.json()

    depends(`id-${params.item}`)

    return {
        item
    }
}) satisfies PageLoad
