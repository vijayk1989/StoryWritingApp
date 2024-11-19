import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Chapter } from '../types/chapter'
import { type PartialBlock } from '@blocknote/core'

interface ChapterState {
    chapters: Chapter[]
    currentChapter: Chapter | null
    isLoading: boolean
    isCreating: boolean
    error: string | null
    fetchChapters: (storyId: string) => Promise<void>
    fetchChapter: (id: string) => Promise<void>
    createChapter: (data: Partial<Chapter>) => Promise<void>
    updateChapter: (id: string, data: Partial<Chapter>) => Promise<void>
    deleteChapter: (id: string) => Promise<void>
    setCurrentChapter: (chapter: Chapter | null) => void
}

interface ChapterData {
    content: PartialBlock[]
}

export const useChapterStore = create<ChapterState>((set, get) => ({
    chapters: [],
    currentChapter: null,
    isLoading: false,
    isCreating: false,
    error: null,

    setCurrentChapter: (chapter) => set({ currentChapter: chapter }),

    fetchChapter: async (id: string) => {
        set({ isLoading: true })
        try {
            console.log('Fetching chapter with id:', id);
            const { data, error } = await supabase
                .from('chapters')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            console.log('Fetched chapter data:', data);

            // Ensure chapter_data.content is properly parsed
            if (data.chapter_data && typeof data.chapter_data === 'string') {
                data.chapter_data = JSON.parse(data.chapter_data);
            }

            set({ currentChapter: data, error: null })
            return data
        } catch (error) {
            console.error('Error in fetchChapter:', error);
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    fetchChapters: async (storyId: string) => {
        set({ isLoading: true })
        try {
            const { data, error } = await supabase
                .from('chapters')
                .select('*')
                .eq('story_id', storyId)
                .order('chapter_number', { ascending: true })

            if (error) throw error
            set({ chapters: data || [], error: null })
        } catch (error) {
            set({ error: (error as Error).message })
        } finally {
            set({ isLoading: false })
        }
    },

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

            // Calculate next chapter number
            const nextChapterNumber = existingChapters && existingChapters.length > 0
                ? existingChapters[0].chapter_number + 1
                : 1

            // Create new chapter with calculated number
            const { data, error } = await supabase
                .from('chapters')
                .insert([{
                    ...chapterData,
                    chapter_number: nextChapterNumber
                }])
                .select()
                .single()

            if (error) throw error
            const { chapters } = get()
            set({ chapters: [...chapters, data], error: null })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updateChapter: async (id: string, chapterData: { chapter_data?: { content: PartialBlock[] } } & Partial<Chapter>) => {
        try {
            const { data, error } = await supabase
                .from('chapters')
                .update(chapterData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            const { chapters } = get()
            set({
                chapters: chapters.map(ch => ch.id === id ? data : ch),
                currentChapter: data
            })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    deleteChapter: async (id: string) => {
        try {
            const { error } = await supabase
                .from('chapters')
                .delete()
                .eq('id', id)

            if (error) throw error
            const { chapters } = get()
            set({ chapters: chapters.filter(ch => ch.id !== id) })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))
