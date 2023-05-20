import type { PageLoad } from "./$types"
import type { HackerNewsItem } from "$lib/hacker-news/api-types"
import { sanitizeItem } from "$lib/hacker-news/api-types"
import { hasMore } from "$lib/pagination/hasMore"

const pageSize = 30

export const load = (async ({ fetch, depends, url }) => {
    const topStoriesReq = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
    const topStories: number[] = await topStoriesReq.json()
    const page = parseInt(url.searchParams.get("p") || "1")

    const startIndex = (page - 1) * pageSize
    const ids = topStories.slice(startIndex, startIndex + pageSize)

    let counter = startIndex + 1

    const stories = await Promise.all(
        ids.map(async (id) => {
            const count = counter++
            const storyReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            const result = sanitizeItem(await storyReq.json())
            result.__semCount = count
            return result as HackerNewsItem<typeof result.type>
        })
    )

    depends(`top-stories:page-${page}`)

    const hasNextLink = hasMore(topStories.length, page, pageSize)

    return {
        stories,
        total: topStories.length,
        prevLink: page === 1 ? undefined : page - 1 === 1 ? "/" : `/?p=${page - 1}`,
        nextLink: hasNextLink ? `/?p=${page + 1}` : undefined
    }
}) satisfies PageLoad
