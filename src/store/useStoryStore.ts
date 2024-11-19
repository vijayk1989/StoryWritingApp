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
    error: string | null
    createStory: (title: string) => Promise<void>
    deleteStory: (id: string) => Promise<void>
}

export const useStoryStore = create<StoryState>((set) => ({
    isCreating: false,
    error: null,

    createStory: async (title: string) => {
        set({ isCreating: true })
        try {
            const formData = new FormData()
            formData.append('title', title)

            const response = await fetch('/api/stories/create', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to create story')
            }

            // Revalidate the stories list
            await mutate('/api/stories')
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
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

            // Revalidate the stories list
            await mutate('/api/stories')
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))
