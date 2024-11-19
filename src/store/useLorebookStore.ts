import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Lorebook, LorebookItem } from '../types/lorebook'
import useSWR, { mutate } from 'swr'

// SWR fetcher functions
const fetchLorebook = async (storyId: string) => {
    const { data, error } = await supabase
        .from('lorebooks')
        .select('*')
        .eq('story_id', storyId)
        .single()

    if (error) throw error
    return data
}

// Custom hook for lorebook data
export const useLorebook = (storyId: string) => {
    return useSWR(
        storyId ? `lorebook/${storyId}` : null,
        () => fetchLorebook(storyId)
    )
}

// SWR fetcher for lorebook items
const fetchLorebookItems = async (lorebookId: string) => {
    const { data, error } = await supabase
        .from('lorebook_items')
        .select('*')
        .eq('lorebook_id', lorebookId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

// Custom hook for lorebook items
export const useLorebookItems = (lorebookId: string) => {
    return useSWR(
        lorebookId ? `lorebook-items/${lorebookId}` : null,
        () => fetchLorebookItems(lorebookId)
    )
}

interface LorebookState {
    isCreating: boolean
    error: string | null
    createLorebookItem: (data: Partial<LorebookItem>) => Promise<void>
    updateLorebookItem: (id: string, data: Partial<LorebookItem>) => Promise<void>
    deleteLorebookItem: (id: string, lorebookId: string) => Promise<void>
}

export const useLorebookStore = create<LorebookState>((set) => ({
    isCreating: false,
    error: null,

    createLorebookItem: async (itemData) => {
        set({ isCreating: true })
        try {
            const { error } = await supabase
                .from('lorebook_items')
                .insert([itemData])

            if (error) throw error
            // Revalidate the items list
            await mutate(`lorebook-items/${itemData.lorebook_id}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updateLorebookItem: async (id: string, itemData) => {
        try {
            const { error } = await supabase
                .from('lorebook_items')
                .update(itemData)
                .eq('id', id)

            if (error) throw error
            // Revalidate the items list
            await mutate(`lorebook-items/${itemData.lorebook_id}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    deleteLorebookItem: async (id: string, lorebookId: string) => {
        try {
            const { error } = await supabase
                .from('lorebook_items')
                .delete()
                .eq('id', id)

            if (error) throw error
            // Revalidate the items list
            await mutate(`lorebook-items/${lorebookId}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))