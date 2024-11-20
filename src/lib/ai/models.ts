import type { AIModel } from '../../types/ai'

export function createLocalModel(url: string): AIModel {
    return {
        id: 'local-model',
        name: 'Local Model',
        vendor: 'Local',
        context_length: 4096,
        description: 'Local LLM instance',
        pricing: {
            prompt: '0',
            completion: '0'
        }
    }
}

export function filterAvailableModels(models: AIModel[], settings: { local_url?: string }): AIModel[] {
    const availableModels = [...models]

    if (settings.local_url) {
        availableModels.push(createLocalModel(settings.local_url))
    }

    return availableModels
}
