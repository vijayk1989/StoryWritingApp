import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Chapter } from '../types/chapter'
import useSWR, { mutate } from 'swr'
import { summariesDB } from '../lib/indexedDB'

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

// Modify the custom hook for single chapter
export const useChapter = (chapterId: string) => {
    return useSWR(
        chapterId ? `chapter/${chapterId}` : null,
        () => fetchChapter(chapterId),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false
        }
    )
}

interface ChapterState {
    isCreating: boolean
    isSaving: boolean
    error: string | null
    currentStoryId: string | null
    summariesSoFar: string
    createChapter: (data: Partial<Chapter>) => Promise<void>
    updateChapter: (id: string, data: Partial<Chapter>) => Promise<void>
    deleteChapter: (id: string, storyId: string) => Promise<void>
    setCurrentStory: (storyId: string | null) => Promise<void>
    getPreviousChapterSummaries: (storyId: string, currentChapterNumber: number) => Promise<string>
    updateStoredSummaries: (storyId: string, optimisticData?: Chapter[]) => Promise<void>
    clearStoredSummaries: () => Promise<void>
}

export const useChapterStore = create<ChapterState>((set, get) => ({
    isCreating: false,
    isSaving: false,
    error: null,
    currentStoryId: null,
    summariesSoFar: '',

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

            const { data, error } = await supabase
                .from('chapters')
                .insert([{
                    ...chapterData,
                    chapter_number: nextChapterNumber
                }])
                .select()
                .single()

            if (error) throw error

            // Update the cache with the real data from the server
            mutate(
                `chapters/${chapterData.story_id}`,
                (chapters: Chapter[] | undefined) => {
                    if (!chapters) return [data]
                    return [...chapters.filter(ch => !ch.id.startsWith('temp-')), data]
                },
                false
            )

            return data // Return the created chapter with its real ID
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updateChapter: async (id: string, chapterData: Partial<Chapter>): Promise<void> => {
        try {
            // Update cache first
            mutate(
                `chapter/${id}`,
                (chapter: Chapter | undefined) => {
                    if (!chapter) return chapter
                    return { ...chapter, ...chapterData }
                },
                {
                    revalidate: false,
                    populateCache: true
                }
            )

            const { error } = await supabase
                .from('chapters')
                .update(chapterData)
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            // Revert cache on error
            mutate(`chapter/${id}`)
            set({ error: (error as Error).message })
            throw error
        }
    },

    deleteChapter: async (id: string, storyId: string): Promise<void> => {
        try {
            const { error } = await supabase
                .from('chapters')
                .delete()
                .eq('id', id)

            if (error) throw error

            // Don't return anything to match Promise<void>
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    setCurrentStory: async (storyId) => {
        if (storyId !== get().currentStoryId) {
            set({ currentStoryId: storyId })
            if (storyId) {
                await get().updateStoredSummaries(storyId)
            }
        }
    },

    // Update IndexedDB with all chapter summaries
    updateStoredSummaries: async (storyId: string, optimisticData?: Chapter[]) => {
        try {
            const chapters = optimisticData || await fetchChapters(storyId)
            if (!chapters) return

            const summariesArray = chapters
                .sort((a, b) => a.chapter_number - b.chapter_number)
                .map(chapter => ({
                    chapter_number: chapter.chapter_number,
                    summary: chapter.summary?.trim() || ''
                }))
                .filter(summary => summary.summary !== '')

            await summariesDB.setSummaries(storyId, summariesArray)
        } catch (error) {
            console.error('Error updating stored summaries:', error)
        }
    },

    // Get summaries for previous chapters
    getPreviousChapterSummaries: async (storyId: string, currentChapterNumber: number) => {
        try {
            // First try to get from IndexedDB
            let summariesArray = await summariesDB.getSummaries(storyId)

            // If not in IndexedDB, fetch from database
            if (!summariesArray || summariesArray.length === 0) {
                const chapters = await fetchChapters(storyId)
                if (!chapters) return ''

                // Create array of chapter summaries
                summariesArray = chapters
                    .map(chapter => ({
                        chapter_number: chapter.chapter_number,
                        summary: chapter.summary?.trim() || ''
                    }))
                    .filter(summary => summary.summary !== '')

                // Store for future use
                await summariesDB.setSummaries(storyId, summariesArray)
            }

            // Get only summaries for previous chapters
            const previousSummaries = summariesArray
                .filter(summary => summary.chapter_number <= currentChapterNumber)
                .sort((a, b) => a.chapter_number - b.chapter_number)
                .map(summary => summary.summary)
                .join(' ')

            set({ summariesSoFar: previousSummaries })
            return previousSummaries
        } catch (error) {
            console.error('Error getting previous chapter summaries:', error)
            return ''
        }
    },

    clearStoredSummaries: async () => {
        try {
            const storyId = get().currentStoryId
            if (storyId) {
                await summariesDB.clearSummaries(storyId)
            }
            set({ summariesSoFar: '' })
        } catch (error) {
            console.error('Error clearing stored summaries:', error)
        }
    },
}))
