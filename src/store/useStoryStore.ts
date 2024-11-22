import { create } from 'zustand'
import useSWR, { mutate } from 'swr'

// SWR fetcher function
const fetchStories = async () => {
    const response = await fetch('/api/stories')
    if (!response.ok) throw new Error('Failed to fetch stories')
    return response.json()
}

// Custom hook for stories data
export const useStories = () => {
    return useSWR('/api/stories', fetchStories)
}

// SWR fetcher for single story
const fetchStory = async (storyId: string) => {
    const response = await fetch(`/api/stories/${storyId}`)
    if (!response.ok) throw new Error('Failed to fetch story')
    return response.json()
}

// Custom hook for single story
export const useStory = (storyId: string) => {
    return useSWR(
        storyId ? `/api/stories/${storyId}` : null,
        () => fetchStory(storyId)
    )
}

interface StoryState {
    isCreating: boolean
    isUpdating: boolean
    error: string | null
    createStory: (title: string, language: string, author: string) => Promise<{
        id: string;
        title: string;
        language: string;
        author: string;
        created_at: string;
        user_id: string;
    }>
    updateStory: (id: string, data: {
        title: string;
        language: string;
        author: string;
    }) => Promise<{
        id: string;
        title: string;
        language: string;
        author: string;
        created_at: string;
        user_id: string;
    }>
    deleteStory: (id: string) => Promise<void>
}

export const useStoryStore = create<StoryState>((set) => ({
    isCreating: false,
    isUpdating: false,
    error: null,

    createStory: async (title: string, language: string, author: string) => {
        set({ isCreating: true })
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('language', language)
            formData.append('author', author)

            const response = await fetch('/api/stories/create', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to create story')
            }

            const story = await response.json()
            await mutate('/api/stories')
            return story
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updateStory: async (id: string, { title, language, author }) => {
        set({ isUpdating: true })
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('language', language)
            formData.append('author', author)

            const response = await fetch(`/api/stories/${id}/update`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update story')
            }

            const story = await response.json()
            await mutate('/api/stories')
            await mutate(`/api/stories/${id}`)
            return story
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isUpdating: false })
        }
    },

    deleteStory: async (id: string) => {
        try {
            const response = await fetch(`/api/stories/${id}/delete`, {
                method: 'POST'
            })

            if (!response.ok) {
                throw new Error('Failed to delete story')
            }

            await mutate('/api/stories')
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))
