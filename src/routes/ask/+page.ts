import type { PageLoad } from "./$types"
import type { HackerNewsItem } from "$lib/hacker-news/api-types"
import { sanitizeItem } from "$lib/hacker-news/api-types"

const pageSize = 30

export const load = (async ({ fetch, depends, url }) => {
    const topAskReq = await fetch("https://hacker-news.firebaseio.com/v0/askstories.json")
    const topAsk: number[] = await topAskReq.json()
    const page = parseInt(url.searchParams.get("p") || "1")

    const startIndex = (page - 1) * pageSize
    const ids = topAsk.slice(startIndex, startIndex + pageSize)

    let counter = startIndex + 1

    const asks = await Promise.all(
        ids.map(async (id) => {
            const count = counter++
            const storyReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            const result = sanitizeItem(await storyReq.json())
            result.__semCount = count
            return result as HackerNewsItem<typeof result.type>
        })
    )

    depends(`ask-stories:page-${page}`)

    return {
        asks: asks,
        total: topAsk.length,
        prevLink: page === 1 ? null : page - 1 === 1 ? "/" : `/?p=${page - 1}`,
        nextLink: page === 1 ? `/?p=2` : page === Math.ceil(topAsk.length / pageSize) ? null : `/?p=${page + 1}`
        // pageNumbers: Array.from({ length: Math.ceil(topStories.length / pageSize) }, (_, i) => i + 1)
    }
}) satisfies PageLoad
