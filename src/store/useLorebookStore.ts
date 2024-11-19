import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Lorebook, LorebookItem } from '../types/lorebook'

interface LorebookState {
    lorebook: Lorebook | null
    lorebookItems: LorebookItem[]
    isLoading: boolean
    isCreating: boolean
    error: string | null
    fetchLorebook: (storyId: string) => Promise<void>
    fetchLorebookItems: (lorebookId: string) => Promise<void>
    createLorebookItem: (data: Partial<LorebookItem>) => Promise<void>
    updateLorebookItem: (id: string, data: Partial<LorebookItem>) => Promise<void>
    deleteLorebookItem: (id: string) => Promise<void>
}

export const useLorebookStore = create<LorebookState>((set, get) => ({
    lorebook: null,
    lorebookItems: [],
    isLoading: false,
    isCreating: false,
    error: null,

    fetchLorebook: async (storyId: string) => {
        set({ isLoading: true })
        try {
            const { data, error } = await supabase
                .from('lorebooks')
                .select('*')
                .eq('story_id', storyId)
                .single()

            if (error) throw error
            set({ lorebook: data, error: null })
        } catch (error) {
            set({ error: (error as Error).message })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchLorebookItems: async (lorebookId: string) => {
        set({ isLoading: true })
        try {
            const { data, error } = await supabase
                .from('lorebook_items')
                .select('*')
                .eq('lorebook_id', lorebookId)
                .order('created_at', { ascending: true })

            if (error) throw error
            set({ lorebookItems: data || [], error: null })
        } catch (error) {
            set({ error: (error as Error).message })
        } finally {
            set({ isLoading: false })
        }
    },

    createLorebookItem: async (itemData) => {
        set({ isCreating: true })
        try {
            const { data, error } = await supabase
                .from('lorebook_items')
                .insert([itemData])
                .select()
                .single()

            if (error) throw error
            const { lorebookItems } = get()
            set({ lorebookItems: [...lorebookItems, data], error: null })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updateLorebookItem: async (id: string, itemData) => {
        try {
            const { data, error } = await supabase
                .from('lorebook_items')
                .update(itemData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            const { lorebookItems } = get()
            set({ lorebookItems: lorebookItems.map(item => item.id === id ? data : item) })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    deleteLorebookItem: async (id: string) => {
        try {
            const { error } = await supabase
                .from('lorebook_items')
                .delete()
                .eq('id', id)

            if (error) throw error
            const { lorebookItems } = get()
            set({ lorebookItems: lorebookItems.filter(item => item.id !== id) })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))