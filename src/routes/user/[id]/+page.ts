import type { PageLoad } from "./$types"
import type { User } from "$lib/hacker-news/api-types"

export const load = (async ({ fetch, depends, params }) => {
    const userReq = await fetch(`https://hacker-news.firebaseio.com/v0/user/${params.id}.json`)
    const user: User = await userReq.json()

    depends(`user-${params.id}`)

    return {
        user
    }
}) satisfies PageLoad
