import useSWR from 'swr'
import type { Prompt } from '../types/prompt'

const fetcher = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch prompts')
    return response.json()
}

export function usePrompts() {
    const { data, error, isLoading } = useSWR<Prompt[]>('/api/prompts', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000 // Cache for 1 minute
    })

    return {
        prompts: data || [],
        systemPrompts: data?.filter(p => !p.user_id) || [],
        userPrompts: data?.filter(p => p.user_id) || [],
        isLoading,
        error
    }
}
