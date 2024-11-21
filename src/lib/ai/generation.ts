import type { AIGenerationConfig, VendorConfig } from '../../types/ai-generation'
import { fetchOpenRouterCompletion } from './openrouter'
import { fetchLocalCompletion } from './local'
import { aiSettingsDB } from '../indexedDB'
import { PromptMessage } from '../../types/prompt'

export async function generateCompletion(
    config: AIGenerationConfig
): Promise<Response> {
    const settings = await aiSettingsDB.getAISettings()

    if (!settings) {
        throw new Error('AI settings not configured')
    }

    const vendorConfig: VendorConfig = {
        vendor: config.vendor,
        apiKey: settings[`${config.vendor.toLowerCase()}_key` as keyof typeof settings] as string,
        baseUrl: settings.local_url
    }

    switch (vendorConfig.vendor.toLowerCase()) {
        case 'openrouter':
            if (!vendorConfig.apiKey) throw new Error('OpenRouter API key is required')
            return fetchOpenRouterCompletion(config, vendorConfig.apiKey)

        case 'local':
            return fetchLocalCompletion(config, vendorConfig.baseUrl)

        default:
            console.error(`Unsupported vendor "${vendorConfig.vendor}". Supported vendors are: openrouter, local`)
            throw new Error(`Unsupported vendor: ${vendorConfig.vendor}`)
    }
}

export async function generateProse(
    messages: PromptMessage[],
    model: string = 'llama-3.2-3b-instruct'  // default model
): Promise<Response> {
    const config: AIGenerationConfig = {
        messages,
        model,
        stream: true,
        temperature: 0.7
    }

    return generateCompletion(config)
}
