import { SWRConfig } from 'swr'

// Create a singleton cache provider outside of the component
const globalCacheProvider = new Map()

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        keepPreviousData: true,
        // Use the singleton cache provider instead of creating a new one
        provider: () => globalCacheProvider,
      }}
    >
      {children}
    </SWRConfig>
  )
}
