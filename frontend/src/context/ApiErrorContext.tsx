'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ApiError } from '@/lib/api-error';

type ApiErrorState = {
  error: ApiError | null;
  clearError: () => void;
};

const ApiErrorContext = createContext<ApiErrorState | null>(null);

export function ApiErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ApiError>).detail;
      setError(detail);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('api-error', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('api-error', handler);
      }
    };
  }, []);

  const value = useMemo(() => ({ error, clearError: () => setError(null) }), [error]);

  return <ApiErrorContext.Provider value={value}>{children}</ApiErrorContext.Provider>;
}

export function useApiError() {
  const ctx = useContext(ApiErrorContext);
  if (!ctx) throw new Error('useApiError must be used within ApiErrorProvider');
  return ctx;
}
