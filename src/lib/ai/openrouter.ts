import type { AIModel } from '../../types/ai';
import type { AIGenerationConfig } from '../../types/ai-generation';

export async function fetchOpenRouterModels(apiKey: string): Promise<AIModel[]> {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch OpenRouter models');
    }

    const { data: openRouterModels } = await response.json();
    return openRouterModels.map((model: any) => ({
        id: model.id,
        name: model.name,
        vendor: 'OpenRouter' as const,
        context_length: model.context_length,
        description: model.description,
        pricing: model.pricing
    }));
}

export async function fetchOpenRouterCompletion(
    config: AIGenerationConfig,
    apiKey: string
): Promise<Response> {
    const requestBody = {
        model: config.model,
        messages: config.messages,
        stream: config.stream ?? true,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.max_tokens ?? 500
    };

    console.log('OpenRouter request details:', {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
            'Authorization': 'Bearer [REDACTED]',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Story Writing App',
            'Content-Type': 'application/json'
        },
        body: requestBody
    });

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Story Writing App',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('OpenRouter error response:', {
                status: response.status,
                statusText: response.statusText,
                errorData,
                headers: Object.fromEntries(response.headers.entries())
            });

            throw new Error(
                `OpenRouter API error: ${errorData?.error?.message ||
                errorData?.message ||
                response.statusText
                }`
            );
        }

        return response;
    } catch (error) {
        console.error('OpenRouter request failed:', error);
        throw error;
    }
}
