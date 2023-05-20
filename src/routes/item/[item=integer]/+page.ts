import type { PageLoad } from "./$types"
import type { Comment, HackerNewsItems } from "$lib/hacker-news/api-types"
import { sanitizeItem } from "$lib/hacker-news/api-types"

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

    let kids = await getKids(item.kids || [])

    kids = kids.filter((k) => k.deleted !== true)

    const kidsCount = kids.length

    const prevLink = page === 1 ? null : page === 2 ? `/item/${params.item}` : `/item/${params.item}?p=${page - 1}`
    const nextLink = page === Math.ceil(kidsCount / pageSize) ? null : `/item/${params.item}?p=${page + 1}`

    depends(`id-${params.item}`)

    return {
        item,
        kids,
        prevLink,
        nextLink
    }
}) satisfies PageLoad
