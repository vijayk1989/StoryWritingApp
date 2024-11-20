import { create } from 'zustand'
import type { Prompt, PromptMessage, CreatePromptData } from '../types/prompt'

interface PromptState {
    prompts: Prompt[]
    systemPrompts: Prompt[]
    currentPrompt: Prompt | null
    isLoading: boolean
    isCreating: boolean
    error: string | null
    validatePromptData: (messages: PromptMessage[]) => boolean
    fetchPrompts: () => Promise<void>
    createPrompt: (data: CreatePromptData) => Promise<Prompt>
    updatePrompt: (id: string, data: Partial<CreatePromptData>) => Promise<Prompt>
    deletePrompt: (id: string) => Promise<void>
    setCurrentPrompt: (prompt: Prompt | null) => void
}

export const usePromptStore = create<PromptState>((set, get) => ({
    prompts: [],
    systemPrompts: [],
    currentPrompt: null,
    isLoading: false,
    isCreating: false,
    error: null,

    validatePromptData: (messages) => {
        return messages.every(msg =>
            typeof msg === 'object' &&
            ('role' in msg) &&
            ('content' in msg) &&
            ['system', 'user', 'assistant'].includes(msg.role) &&
            typeof msg.content === 'string'
        )
    },

    setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

    fetchPrompts: async () => {
        set({ isLoading: true })
        try {
            const response = await fetch('/api/prompts')
            if (!response.ok) throw new Error('Failed to fetch prompts')
            const data = await response.json()

            const userPrompts = data.filter((p: Prompt) => p.user_id)
            const systemPrompts = data.filter((p: Prompt) => !p.user_id)

            set({
                prompts: userPrompts,
                systemPrompts,
                error: null
            })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    createPrompt: async ({ name, prompt_data, allowed_models }) => {
        set({ isCreating: true })
        try {
            if (!get().validatePromptData(prompt_data)) {
                throw new Error('Invalid prompt data structure')
            }

            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, prompt_data, allowed_models })
            })

            if (!response.ok) throw new Error('Failed to create prompt')
            const data = await response.json()

            const { prompts } = get()
            set({
                prompts: [data, ...prompts],
                currentPrompt: data,
                error: null
            })
            return data
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updatePrompt: async (id: string, { name, prompt_data, allowed_models }) => {
        try {
            if (prompt_data && !get().validatePromptData(prompt_data)) {
                throw new Error('Invalid prompt data structure')
            }

            const response = await fetch(`/api/prompts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, prompt_data, allowed_models })
            })

            if (!response.ok) throw new Error('Failed to update prompt')
            const data = await response.json()

            const { prompts } = get()
            set({
                prompts: prompts.map(p => p.id === id ? data : p),
                currentPrompt: data,
                error: null
            })
            return data
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    deletePrompt: async (id: string) => {
        try {
            const response = await fetch(`/api/prompts/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete prompt')

            const { prompts, currentPrompt } = get()
            set({
                prompts: prompts.filter(p => p.id !== id),
                currentPrompt: currentPrompt?.id === id ? null : currentPrompt,
                error: null
            })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))
