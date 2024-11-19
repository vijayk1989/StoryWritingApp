export interface Prompt {
    id: string
    user_id: string
    name: string
    prompt_data: PromptMessage[]
    created_at: string
}

export interface PromptMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

// Optional: Helper type for creating new prompts
export interface CreatePromptData {
    name: string
    prompt_data: PromptMessage[]
}