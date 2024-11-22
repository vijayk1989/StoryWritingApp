import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { LorebookItem } from '../types/lorebook'
import useSWR, { mutate } from 'swr'
import { lorebookDB } from '../lib/indexedDB'

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

// Type for simplified lorebook item
interface SimplifiedLorebookItem {
    name: string
    tags: string | string[]
    classification: string
    lore_type: string
    description: string
}

interface LorebookItemsByTag {
    [tag: string]: SimplifiedLorebookItem
}

// Helper function to simplify lorebook item
const simplifyLorebookItem = (item: LorebookItem): SimplifiedLorebookItem => {
    const {
        name,
        tags,
        classification,
        lore_type,
        description
    } = item

    return {
        name,
        tags,
        classification,
        lore_type,
        description
    }
}

interface LorebookState {
    currentStoryId: string | null
    lorebookItems: LorebookItem[]
    lorebookItemsByTag: LorebookItemsByTag
    isCreating: boolean
    error: string | null
    setCurrentStory: (storyId: string | null) => void
    setLorebookItems: (items: LorebookItem[]) => void
    createLorebookItem: (data: Partial<LorebookItem>) => Promise<void>
    updateLorebookItem: (id: string, data: Partial<LorebookItem>) => Promise<void>
    deleteLorebookItem: (id: string, lorebookId: string) => Promise<void>
    findItemByTag: (tag: string) => SimplifiedLorebookItem | undefined
    getCharactersByStoryId: (storyId: string) => Promise<SimplifiedLorebookItem[]>
}

// Helper function to convert array to tag-based map
const createTagMap = (items: LorebookItem[]): LorebookItemsByTag => {
    const tagMap: LorebookItemsByTag = {}

    items.forEach(item => {
        const simplifiedItem = simplifyLorebookItem(item)

        // Add the item name as a tag
        const normalizedName = item.name.toLowerCase().trim()
        tagMap[normalizedName] = simplifiedItem

        // Handle tags whether they're a string or array
        if (item.tags) {
            let tagsArray: string[] = []

            if (typeof item.tags === 'string') {
                // Split string tags and handle potential spaces after commas
                tagsArray = item.tags.split(',').map(tag => tag.trim())
            } else if (Array.isArray(item.tags)) {
                tagsArray = item.tags
            }

            // Add each tag to the map
            tagsArray.forEach(tag => {
                const normalizedTag = tag.toLowerCase().trim()
                tagMap[normalizedTag] = simplifiedItem
            })
        }
    })

    return tagMap
}

export const useLorebookStore = create<LorebookState>((set, get) => ({
    currentStoryId: null,
    lorebookItems: [],
    lorebookItemsByTag: {},
    isCreating: false,
    error: null,

    setCurrentStory: async (storyId) => {
        if (storyId !== get().currentStoryId) {
            set({
                lorebookItems: [],
                lorebookItemsByTag: {}
            })

            if (storyId) {
                try {
                    const cachedItems = await lorebookDB.getItems(storyId)
                    if (cachedItems?.length > 0) {
                        set({
                            currentStoryId: storyId,
                            lorebookItems: cachedItems,
                            lorebookItemsByTag: createTagMap(cachedItems)
                        })
                        return
                    }
                } catch (error) {
                    console.error('Error loading from IndexedDB:', error)
                }
            } else {
                try {
                    await lorebookDB.clearAll()
                } catch (error) {
                    console.error('Error clearing IndexedDB:', error)
                }
            }

            set({ currentStoryId: storyId })
        }
    },

    setLorebookItems: async (items) => {
        set({
            lorebookItems: items,
            lorebookItemsByTag: createTagMap(items)
        })

        const storyId = get().currentStoryId
        if (storyId) {
            try {
                await lorebookDB.setItems(storyId, items)
            } catch (error) {
                console.error('Error caching to IndexedDB:', error)
            }
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

            const newItems = [...get().lorebookItems, data]
            set({
                lorebookItems: newItems,
                lorebookItemsByTag: createTagMap(newItems)
            })

            const storyId = get().currentStoryId
            if (storyId) {
                await lorebookDB.setItems(storyId, newItems)
            }

            await mutate(`lorebook-items/${itemData.lorebook_id}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        } finally {
            set({ isCreating: false })
        }
    },

    updateLorebookItem: async (id, itemData) => {
        try {
            const { data, error } = await supabase
                .from('lorebook_items')
                .update(itemData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            const updatedItems = get().lorebookItems.map(item =>
                item.id === id ? { ...item, ...data } : item
            )
            set({
                lorebookItems: updatedItems,
                lorebookItemsByTag: createTagMap(updatedItems)
            })

            const storyId = get().currentStoryId
            if (storyId) {
                await lorebookDB.setItems(storyId, updatedItems)
            }

            await mutate(`lorebook-items/${itemData.lorebook_id}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    deleteLorebookItem: async (id, lorebookId) => {
        try {
            const { error } = await supabase
                .from('lorebook_items')
                .delete()
                .eq('id', id)

            if (error) throw error

            const updatedItems = get().lorebookItems.filter(item => item.id !== id)
            set({
                lorebookItems: updatedItems,
                lorebookItemsByTag: createTagMap(updatedItems)
            })

            const storyId = get().currentStoryId
            if (storyId) {
                await lorebookDB.setItems(storyId, updatedItems)
            }

            await mutate(`lorebook-items/${lorebookId}`)
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    },

    // Helper function to find item by tag (case-insensitive)
    findItemByTag: (tag: string) => {
        const normalizedTag = tag.toLowerCase().trim()
        return get().lorebookItemsByTag[normalizedTag]
    },

    getCharactersByStoryId: async (storyId: string) => {
        try {
            // First try to get the lorebook ID
            const { data: lorebook } = await supabase
                .from('lorebooks')
                .select('id')
                .eq('story_id', storyId)
                .single()

            if (!lorebook) return []

            // Try to get from IndexedDB first
            const cachedItems = await lorebookDB.getItems(storyId)
            let items: LorebookItem[] = []

            if (cachedItems?.length > 0) {
                items = cachedItems
            } else {
                // If not in cache, fetch from DB
                items = await fetchLorebookItems(lorebook.id)
            }

            // Filter and simplify character items
            return items
                .filter(item => item.classification === 'Character')
                .map(simplifyLorebookItem)
        } catch (error) {
            console.error('Error fetching characters:', error)
            return []
        }
    }
}))

// Custom hook for lorebook items
export const useLorebookItems = (lorebookId?: string) => {
    const { currentStoryId, lorebookItems, setLorebookItems } = useLorebookStore()

    return useSWR(
        lorebookId ? `lorebook-items/${lorebookId}` : null,
        async () => {
            // If we have items in cache and we're in the same story context, use them
            if (lorebookItems.length > 0 && currentStoryId) {
                return lorebookItems
            }

            // Try to load from IndexedDB first
            if (currentStoryId) {
                try {
                    const cachedItems = await lorebookDB.getItems(currentStoryId)
                    if (cachedItems?.length > 0) {
                        setLorebookItems(cachedItems)
                        return cachedItems
                    }
                } catch (error) {
                    console.error('Error loading from IndexedDB:', error)
                }
            }

            // Fetch from DB if not in cache and we have a lorebookId
            if (lorebookId) {
                const items = await fetchLorebookItems(lorebookId)
                setLorebookItems(items)
                return items
            }

            return []
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )
}
