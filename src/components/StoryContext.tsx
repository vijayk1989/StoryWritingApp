import { useEffect } from 'react'
import { useLorebookStore, useLorebookItems } from '../store/useLorebookStore'
import { supabase } from '../lib/supabase'
import useSWR from 'swr'

interface StoryContextProps {
    storyId: string
}

export const StoryContext = ({ storyId }: StoryContextProps) => {
    const { setCurrentStory } = useLorebookStore()

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
        // Set current story in lorebook store
        setCurrentStory(storyId)

        // Cleanup when leaving story context
        return () => {
            setCurrentStory(null)
        }
    }, [storyId])

    return null
}
