import { create } from 'zustand'
import { aiSettingsDB, vendorModelsDB } from '../lib/indexedDB'
import type { AIModel } from '../types/ai'
import toast from 'react-hot-toast'

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

interface AIModelsState {
    models: AIModel[]
    isLoading: boolean
    error: string | null
    lastUpdated: number | null
    // TODO: Add a way to force refresh models cache
    fetchModels: (force?: boolean) => Promise<void>
}

export const useAIModelsStore = create<AIModelsState>((set, get) => ({
    models: [],
    isLoading: false,
    error: null,
    lastUpdated: null,

    fetchModels: async (force = false) => {
        set({ isLoading: true })
        try {
            const cachedModels = await vendorModelsDB.getVendorModels()
            const now = Date.now()

            if (!force && cachedModels && (now - cachedModels.lastUpdated) < CACHE_DURATION) {
                const allModels = [
                    ...(cachedModels.openrouter || []),
                    ...(cachedModels.local || [])
                ]
                set({
                    models: allModels,
                    lastUpdated: cachedModels.lastUpdated,
                    error: null
                })
                return
            }

            const settings = await aiSettingsDB.getAISettings()
            if (!settings) {
                set({ models: [], error: null })
                return
            }

            const response = await fetch('/api/ai/models', {
                headers: {
                    'x-openrouter-key': settings.openrouter_key || '',
                    'x-local-url': settings.local_url || '',
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch models')
            }

            const { models: newModels } = await response.json()

            await vendorModelsDB.setVendorModels({
                openrouter: newModels.filter(m => m.vendor === 'OpenRouter'),
                local: newModels.filter(m => m.vendor === 'Local'),
                lastUpdated: now
            })

            set({
                models: newModels,
                lastUpdated: now,
                error: null
            })
        } catch (error) {
            const message = (error as Error).message
            set({ error: message })
            toast.error('Failed to fetch AI models')
            console.error('Error fetching models:', error)
        } finally {
            set({ isLoading: false })
        }
    }
}))
