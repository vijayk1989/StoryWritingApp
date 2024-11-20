import { create } from 'zustand'
import { aiSettingsDB } from '../lib/indexedDB'

export type Vendor = 'OpenAI' | 'Mistral' | 'Claude' | 'OpenRouter' | 'Local'

interface AISettings {
    openai_key?: string
    mistral_key?: string
    claude_key?: string
    openrouter_key?: string
    local_url?: string
    preferred_vendor: Vendor
}

interface AISettingsState {
    settings: AISettings | null
    isLoading: boolean
    error: string | null
    loadSettings: () => Promise<void>
    updateSettings: (settings: Partial<AISettings>) => Promise<void>
}

export const useAISettingsStore = create<AISettingsState>((set, get) => ({
    settings: null,
    isLoading: false,
    error: null,

    loadSettings: async () => {
        set({ isLoading: true })
        try {
            const settings = await aiSettingsDB.getAISettings()
            set({ settings, error: null })
        } catch (error) {
            set({ error: (error as Error).message })
        } finally {
            set({ isLoading: false })
        }
    },

    updateSettings: async (newSettings) => {
        try {
            const currentSettings = get().settings || {
                preferred_vendor: 'OpenAI' as Vendor
            }
            const updatedSettings = { ...currentSettings, ...newSettings }
            await aiSettingsDB.setAISettings(updatedSettings)
            set({ settings: updatedSettings, error: null })
        } catch (error) {
            set({ error: (error as Error).message })
            throw error
        }
    }
}))
