import { SWRConfig } from 'swr'

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
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  )
}
