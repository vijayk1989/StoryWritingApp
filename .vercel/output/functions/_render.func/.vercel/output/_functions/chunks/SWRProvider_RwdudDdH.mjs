import { jsx } from 'react/jsx-runtime';
import { SWRConfig } from 'swr';

const globalCacheProvider = /* @__PURE__ */ new Map();
function SWRProvider({ children }) {
  return /* @__PURE__ */ jsx(
    SWRConfig,
    {
      value: {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 5e3,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        keepPreviousData: true,
        // Use the singleton cache provider instead of creating a new one
        provider: () => globalCacheProvider
      },
      children
    }
  );
}

export { SWRProvider as S };
