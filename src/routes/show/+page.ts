import type { PageLoad } from "./$types"
import type { HackerNewsItem } from "$lib/hacker-news/api-types"
import { sanitizeItem } from "$lib/hacker-news/api-types"
import { hasMore } from "$lib/pagination/hasMore"

const pageSize = 30

export const load = (async ({ fetch, depends, url }) => {
    const showReq = await fetch("https://hacker-news.firebaseio.com/v0/showstories.json")
    const showIds: number[] = await showReq.json()
    const page = parseInt(url.searchParams.get("p") || "1")

    const startIndex = (page - 1) * pageSize
    const ids = showIds.slice(startIndex, startIndex + pageSize)

    let counter = startIndex + 1

    const shows = await Promise.all(
        ids.map(async (id) => {
            const count = counter++
            const storyReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            const result = sanitizeItem(await storyReq.json())
            result.__semCount = count
            return result as HackerNewsItem<typeof result.type>
        })
    )

    depends(`show-stories:page-${page}`)

    const hasNextLink = hasMore(showIds.length, page, pageSize)

    return {
        shows: shows,
        prevLink: page === 1 ? null : page - 1 === 1 ? "/show" : `/show?p=${page - 1}`,
        nextLink: hasNextLink ? `/show?p=${page + 1}` : null
    }
}) satisfies PageLoad
