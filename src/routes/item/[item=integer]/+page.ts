import type { PageLoad } from "./$types"
import type { Comment, HackerNewsItems } from "$lib/hacker-news/api-types"
import { sanitizeItem } from "$lib/hacker-news/api-types"
import { hasMore } from "$lib/pagination/hasMore"

export type CommentWithKids = Comment & { kidsData?: Comment[] }

const pageSize = 50

export const load = (async ({ fetch, depends, params, url }) => {
    const itemReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${params.item}.json`)
    const item: HackerNewsItems = sanitizeItem(await itemReq.json())

    const page = parseInt(url.searchParams.get("p") || "1")

    async function getKids(kids: number[]): Promise<Comment[]> {
        const data = await Promise.all(
            kids.map(async (kid) => {
                const kidReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${kid}.json`)

                let kids: CommentWithKids = sanitizeItem(await kidReq.json())

                if (kids.kids) {
                    kids.kidsData = await getKids(kids.kids)
                }

                return kids
            }) ?? []
        )

        return data.filter((k) => k.deleted !== true)
    }

    const ids = (item.kids || []).slice((page - 1) * pageSize, page * pageSize)
    let kids = await getKids(ids)

    kids = kids.filter((k) => k.deleted !== true)

    const kidsCount = kids.length

    depends(`id-${params.item}`)

    if (item.dead) {
        // @ts-ignore
        item.title = "[dead]"
        return {
            item,
            kids
        }
    }

    if (item.deleted) {
        // @ts-ignore
        item.title = "[deleted]"
        return {
            item,
            kids
        }
    }

    const hasNextLink = hasMore(item.kids?.length || 0, page, pageSize)
    const prevLink = page === 1 ? undefined : page === 2 ? `/item/${params.item}` : `/item/${params.item}?p=${page - 1}`
    // nextLink: page === 1 ? `/?p=2` : page === Math.ceil(topStories.length / pageSize) ? null : `/?p=${page + 1}`
    const nextLink = hasNextLink ? `/item/${params.item}?p=${page + 1}` : undefined

    return {
        item,
        kids,
        prevLink,
        nextLink
    }
}) satisfies PageLoad
