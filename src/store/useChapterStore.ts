import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Chapter } from '../types/chapter'
import useSWR, { mutate } from 'swr'

// SWR fetcher functions
const fetchChapters = async (storyId: string) => {
    const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .order('chapter_number', { ascending: true })

    if (error) throw error
    return data
}

// Custom hook for chapters data
export const useChapters = (storyId: string) => {
    return useSWR(
        storyId ? `chapters/${storyId}` : null,
        () => fetchChapters(storyId)
    )
}

// Add a new SWR fetcher for single chapter
const fetchChapter = async (chapterId: string) => {
    const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .single()

    if (error) throw error
    return data
}

// Add a custom hook for single chapter
export const useChapter = (chapterId: string) => {
    return useSWR(
        chapterId ? `chapter/${chapterId}` : null,
        () => fetchChapter(chapterId)
    )
}

interface ChapterState {
    isCreating: boolean
    isSaving: boolean
    error: string | null
    createChapter: (data: Partial<Chapter>) => Promise<void>
    updateChapter: (id: string, data: Partial<Chapter>) => Promise<void>
    deleteChapter: (id: string, storyId: string) => Promise<void>
}

export const useChapterStore = create<ChapterState>((set, get) => ({
    isCreating: false,
    isSaving: false,
    error: null,

    createChapter: async (chapterData) => {
        set({ isCreating: true })
        try {
            // First, get the highest chapter number for this story
            const { data: existingChapters, error: fetchError } = await supabase
                .from('chapters')
                .select('chapter_number')
                .eq('story_id', chapterData.story_id)
                .order('chapter_number', { ascending: false })
                .limit(1)

            if (fetchError) throw fetchError

            const nextChapterNumber = existingChapters && existingChapters.length > 0
                ? existingChapters[0].chapter_number + 1
                : 1

            const { error } = await supabase
                .from('chapters')
                .insert([{
                    ...chapterData,
                    chapter_number: nextChapterNumber
                }])

            if (error) throw error
            // Trigger SWR revalidation instead of managing state
            mutate(`chapters/${chapterData.story_id}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updateChapter: async (id: string, chapterData) => {
        try {
            const { error } = await supabase
                .from('chapters')
                .update(chapterData)
                .eq('id', id)

            if (error) throw error
            // Get storyId from the chapter data or fetch it
            const storyId = chapterData.story_id // You might need to fetch this if not available
            mutate(`chapters/${storyId}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    deleteChapter: async (id: string, storyId: string) => {
        try {
            const { error } = await supabase
                .from('chapters')
                .delete()
                .eq('id', id)

            if (error) throw error
            // Trigger SWR revalidation
            mutate(`chapters/${storyId}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))
