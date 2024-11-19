import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Prompt, PromptMessage, CreatePromptData } from '../types/prompt'

interface PromptState {
    prompts: Prompt[]
    currentPrompt: Prompt | null
    isLoading: boolean
    isCreating: boolean
    error: string | null
    fetchPrompts: () => Promise<void>
    createPrompt: (data: CreatePromptData) => Promise<Prompt>
    updatePrompt: (id: string, data: Partial<CreatePromptData>) => Promise<Prompt>
    deletePrompt: (id: string) => Promise<void>
    setCurrentPrompt: (prompt: Prompt | null) => void
    // Helper method to validate prompt structure
    validatePromptData: (messages: PromptMessage[]) => boolean
}

export const usePromptStore = create<PromptState>((set, get) => ({
    prompts: [],
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
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { data, error } = await supabase
                .from('prompts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            set({ prompts: data || [], error: null })
        } catch (error) {
            set({ error: (error as Error).message })
        } finally {
            set({ isLoading: false })
        }
    },

    createPrompt: async ({ name, prompt_data }) => {
        set({ isCreating: true })
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Validate prompt data structure
            if (!get().validatePromptData(prompt_data)) {
                throw new Error('Invalid prompt data structure')
            }

            const { data, error } = await supabase
                .from('prompts')
                .insert([{
                    name,
                    prompt_data,
                    user_id: user.id
                }])
                .select()
                .single()

            if (error) throw error
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

    updatePrompt: async (id: string, { name, prompt_data }) => {
        try {
            // Validate prompt data structure if it's being updated
            if (prompt_data && !get().validatePromptData(prompt_data)) {
                throw new Error('Invalid prompt data structure')
            }

            const updateData: Partial<Prompt> = {}
            if (name) updateData.name = name
            if (prompt_data) updateData.prompt_data = prompt_data

            const { data, error } = await supabase
                .from('prompts')
                .update(updateData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
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
            const { error } = await supabase
                .from('prompts')
                .delete()
                .eq('id', id)

            if (error) throw error
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
