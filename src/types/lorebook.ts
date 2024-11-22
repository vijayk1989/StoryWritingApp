export interface Lorebook {
    id: string
    name: string
    story_id: string
    created_at: string
}

export interface LorebookItem {
    id: string
    name: string
    tags: string
    classification: string
    lore_type: string
    description: string
    lorebook_id: string
    created_at: string
}

export interface SimplifiedLorebookItem {
    name: string
    tags: string | string[]
    classification: string
    lore_type: string
    description: string
}
