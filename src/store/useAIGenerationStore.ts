import { create } from 'zustand'
import { generateCompletion } from '../lib/ai/generation'
import type { AIGenerationConfig } from '../types/ai-generation'
import { useAIModelsStore } from './useAIModelsStore'
import toast from 'react-hot-toast'

interface AIGenerationState {
    isGenerating: boolean
    error: string | null
    generate: (config: AIGenerationConfig) => Promise<Response>
}

export const useAIGenerationStore = create<AIGenerationState>((set) => ({
    isGenerating: false,
    error: null,

    generate: async (config: AIGenerationConfig) => {
        set({ isGenerating: true, error: null })
        try {
            // Verify model exists in available models
            const model = useAIModelsStore.getState().models
                .find(m => m.id === config.model)

            if (!model) {
                throw new Error('Selected model not found')
            }

            const response = await generateCompletion(config)
            return response
        } catch (error) {
            const message = (error as Error).message
            set({ error: message })
            toast.error(`Generation failed: ${message}`)
            throw error
        } finally {
            set({ isGenerating: false })
        }
    }
}))
