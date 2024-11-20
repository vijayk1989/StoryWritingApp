import type { APIRoute } from 'astro'
import { fetchOpenRouterModels } from '../../../lib/ai/openrouter'
import { filterAvailableModels } from '../../../lib/ai/models'
import type { AIModelResponse } from '../../../types/ai'

export const GET: APIRoute = async ({ request }) => {
    try {
        // Get API key from request header
        const openrouterKey = request.headers.get('x-openrouter-key')
        const localUrl = request.headers.get('x-local-url')

        let models = []

        // Fetch OpenRouter models if API key exists
        if (openrouterKey) {
            const openRouterModels = await fetchOpenRouterModels(openrouterKey)
            models.push(...openRouterModels)
        }

        // Filter and add local model if configured
        const availableModels = filterAvailableModels(models, {
            local_url: localUrl || undefined
        })

        const response: AIModelResponse = { models: availableModels }
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Error fetching AI models:', error)
        return new Response(
            JSON.stringify({ error: (error as Error).message, models: [] }),
            { status: 500 }
        )
    }
}
