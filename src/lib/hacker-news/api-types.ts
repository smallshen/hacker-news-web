export type Item = {
    id: number // The item's unique id.
    deleted?: boolean // true if the item is deleted.
    type: "job" | "story" | "ask" | "show" | "comment" | "poll" | "pollopt" // The type of item. ask is our sanitized version of story.
    by?: string // The username of the item's author.
    time?: number // Creation date of the item, in .
    dead?: boolean // true if the item is dead.
    kids?: number[] // The ids of the item's comments, in ranked display order.
}

export type Job = Item & {
    text?: string // The comment, story or poll text. HTML.
    url?: string // The URL of the story.
    title?: string // The title of the story, poll or job.
}

export type Story = Job & {
    type: "story"
    descendants?: number // In the case of stories or polls, the total comment count.
    score?: number // The story's score, or the votes for a pollopt.
    title?: string // The title of the story, poll or job.
    url: string // The URL of the story.
}

export type Ask = Story & {
    type: "ask"
    url: undefined
}

export type Show = Story & {
    type: "show"
    url: string
}

export type Comment = Item & {
    parent?: number // The comment's parent: either another comment or the relevant story.
    text: string // The comment, story or poll text. HTML.
}

export type Poll = Story & {
    descendants?: number // In the case of stories or polls, the total comment count.
    score?: number // The story's score, or the votes for a pollopt.
    title?: string // The title of the story, poll or job.
    text?: string // The comment, story or poll text. HTML.
}

export type PollOption = Item & {
    parent?: number // The comment's parent: either another comment or the relevant story.
    score?: number // The story's score, or the votes for a pollopt.
}

// conditional types

export function sanitizeItem<T extends Item>(item: T): T {
    if (item.deleted === true) {
        // @ts-ignore
        item.text = "[deleted]"
    }

    // @ts-ignore
    if (item.type === "story" && item.url == null) {
        item.type = "ask"
    }

    // @ts-ignore
    if (item.type === "story" && item.url != null) {
        item.type = "show"
    }

    return item
}

export type HackerNewsItems = Job | Story | Comment | Poll | PollOption

export type HackerNewsItem<T extends string> = T extends "job"
    ? Job
    : T extends "story"
    ? Story
    : T extends "comment"
    ? Comment
    : T extends "poll"
    ? Poll
    : T extends "pollopt"
    ? PollOption
    : T extends "ask"
    ? Ask
    : never

export type User = {
    id: string // The user's unique username. Case-sensitive. Required.
    delay?: number // Delay in minutes between a comment's creation and its visibility to other users.
    created: number // Creation date of the user, in Unix Time.
    karma: number // The user's karma.
    about?: string // The user's optional self-description. HTML.
    submitted?: number[] // List of the user's stories, polls and comments.
}
