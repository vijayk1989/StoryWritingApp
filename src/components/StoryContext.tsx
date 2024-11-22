import { useEffect } from 'react'
import { useLorebookStore, useLorebookItems } from '../store/useLorebookStore'
import { useChapterStore } from '../store/useChapterStore'
import { supabase } from '../lib/supabase'
import { storySettingsDB } from '../lib/indexedDB'
import useSWR from 'swr'

interface StoryContextProps {
    storyId: string
}

export const StoryContext = ({ storyId }: StoryContextProps) => {
    const { setCurrentStory: setLorebookStory } = useLorebookStore()
    const {
        setCurrentStory: setChapterStory,
        clearStoredSummaries,
        updateStoredSummaries
    } = useChapterStore()

    // Use the hook at the component level
    const { data: lorebook } = useSWR(
        storyId ? `lorebook/${storyId}` : null,
        async () => {
            const { data } = await supabase
                .from('lorebooks')
                .select('id')
                .eq('story_id', storyId)
                .single()
            return data
        }
    )

    // Use the lorebook items hook if we have a lorebook
    useLorebookItems(lorebook?.id)

    useEffect(() => {
        const initializeStory = async () => {
            setLorebookStory(storyId)
            setChapterStory(storyId)

            // Load story settings
            if (storyId) {
                try {
                    const settings = await storySettingsDB.getStorySettings(storyId)
                    if (!settings) {
                        // Initialize with defaults if not found
                        await storySettingsDB.setStorySettings(storyId, {
                            language: 'English',
                            author: ''
                        })
                    }
                } catch (error) {
                    console.error('Error loading story settings:', error)
                }
            }

            // Initialize summaries when entering a story
            if (storyId) {
                try {
                    await updateStoredSummaries(storyId)
                } catch (error) {
                    console.error('Error initializing summaries:', error)
                }
            }
        }

        initializeStory()

        // Cleanup when leaving story context
        return () => {
            setLorebookStory(null)
            setChapterStory(null)
            clearStoredSummaries()
        }
    }, [storyId])

    return null
}
