export interface AIModel {
    id: string
    name: string
    vendor: 'OpenRouter' | 'Local'
    context_length: number
    description: string
    pricing: {
        prompt: string
        completion: string
    }
}

export interface AIModelResponse {
    models: AIModel[]
    error?: string
}
