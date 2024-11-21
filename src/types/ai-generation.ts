import type { PromptMessage } from './prompt'
import type { Vendor } from '../store/useAISettingsStore'

export interface AIGenerationConfig {
    model: string
    messages: PromptMessage[]
    temperature?: number
    max_tokens?: number
    stream?: boolean
    vendor?: string
}

export interface AIGenerationResponse {
    id: string
    choices: {
        delta?: {
            content?: string
        }
        message?: {
            content: string
        }
        finish_reason?: string
    }[]
}

export interface VendorConfig {
    vendor: string
    apiKey?: string
    baseUrl?: string
}
