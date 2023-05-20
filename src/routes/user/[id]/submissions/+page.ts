import type { PageLoad } from "./$types"
import type { HackerNewsItem } from "$lib/hacker-news/api-types"
import { sanitizeItem, type User } from "$lib/hacker-news/api-types"

const pageSize = 30

export const load = (async ({ fetch, depends, url, params }) => {
    const userReq = await fetch(`https://hacker-news.firebaseio.com/v0/user/${params.id}.json`)
    const user: User = await userReq.json()

    const submitIds = user.submitted || []

    const page = parseInt(url.searchParams.get("p") || "1")

    const startIndex = (page - 1) * pageSize
    const ids = submitIds.slice(startIndex, startIndex + pageSize)

    let counter = startIndex + 1

    const submits = await Promise.all(
        ids.map(async (id) => {
            const count = counter++
            const storyReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            const result = sanitizeItem(await storyReq.json())
            result.__semCount = count
            return result as HackerNewsItem<typeof result.type>
        })
    )

    depends(`user-${params.id}:page-${page}`)

    return {
        submits: submits,
        prevLink: page === 1 ? null : page - 1 === 1 ? "/" : `/?p=${page - 1}`,
        nextLink: page === 1 ? `/?p=2` : page === Math.ceil(submitIds.length / pageSize) ? null : `/?p=${page + 1}`
    }
}) satisfies PageLoad
