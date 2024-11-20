import type { AIModel } from '../../types/ai'

export async function fetchOpenRouterModels(apiKey: string): Promise<AIModel[]> {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch OpenRouter models')
    }

    const { data: openRouterModels } = await response.json()
    return openRouterModels.map((model: any) => ({
        id: model.id,
        name: model.name,
        vendor: 'OpenRouter' as const,
        context_length: model.context_length,
        description: model.description,
        pricing: model.pricing
    }))
}
