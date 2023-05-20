export interface ItemResponse {
    id: number
    created_at: string
    created_at_i: number
    type: string
    author: string
    title: string
    url: string
    text: string
    points: number
    parent_id: any
    story_id: any
    children: Children[]
    options: any[]
    deleted?: boolean
}

export interface Children {
    id: number
    created_at: string
    created_at_i: number
    type: string
    author?: string
    title: any
    url: any
    text?: string
    points: any
    parent_id: number
    story_id: number
    children: Children[]
    options: any[]
}
