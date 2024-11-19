import { PartialBlock } from '@blocknote/core'

export interface Chapter {
    id: string
    story_id: string
    title: string
    summary?: string
    chapter_number: number
    chapter_data: {
        content: PartialBlock[]
    }
    created_at: string
    updated_at: string
}

export interface ChapterData {
    content: any // Define based on your editor's data structure
}