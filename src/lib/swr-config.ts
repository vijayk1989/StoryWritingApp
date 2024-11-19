import { SWRConfiguration } from 'swr'

export const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false, // Don't revalidate when window focuses
    revalidateOnReconnect: true, // Revalidate when browser regains connection
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
    shouldRetryOnError: true, // Retry on error
    errorRetryCount: 3, // Maximum retry count
    keepPreviousData: true, // Keep showing previous data while revalidating
}
