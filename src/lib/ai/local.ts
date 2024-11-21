import type { AIGenerationConfig } from '../../types/ai-generation'

const DEFAULT_LOCAL_URL = 'http://localhost:1234/v1/chat/completions'

export async function fetchLocalCompletion(
    config: AIGenerationConfig,
    baseUrl: string
): Promise<Response> {
    // Use provided baseUrl or fall back to default, no errors
    const url = baseUrl?.trim() || DEFAULT_LOCAL_URL
    console.log('Local API URL:', url, baseUrl ? '(from settings)' : '(using default)')

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: config.model,
            messages: config.messages,
            stream: config.stream ?? true,
            temperature: config.temperature ?? 0.7,
            max_tokens: config.max_tokens ?? 4096,
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Local API error: ${response.status} ${response.statusText}`)
    }

    return response
}
