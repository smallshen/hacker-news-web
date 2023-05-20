import type { PageLoad } from "./$types"
import type { HackerNewsItem } from "$lib/hacker-news/api-types"
import { sanitizeItem } from "$lib/hacker-news/api-types"

const pageSize = 30

export const load = (async ({ fetch, depends, url }) => {
    const jobReq = await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
    const jobIds: number[] = await jobReq.json()
    const page = parseInt(url.searchParams.get("p") || "1")

    const startIndex = (page - 1) * pageSize
    const ids = jobIds.slice(startIndex, startIndex + pageSize)

    let counter = startIndex + 1

    const jobs = await Promise.all(
        ids.map(async (id) => {
            const count = counter++
            const storyReq = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            const result = sanitizeItem(await storyReq.json())
            result.__semCount = count
            return result as HackerNewsItem<typeof result.type>
        })
    )

    depends(`job-stories:page-${page}`)

    return {
        jobs: jobs,
        prevLink: page === 1 ? null : page - 1 === 1 ? "/" : `/?p=${page - 1}`,
        nextLink: page === 1 ? `/?p=2` : page === Math.ceil(jobIds.length / pageSize) ? null : `/?p=${page + 1}`
    }
}) satisfies PageLoad
