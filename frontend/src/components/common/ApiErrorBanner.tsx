'use client';
import { useApiError } from '@/context/ApiErrorContext';

export default function ApiErrorBanner() {
  const { error, clearError } = useApiError();
  if (!error) return null;
  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 text-red-900 px-4 py-3 shadow-lg flex items-start justify-between gap-3">
        <div className="text-sm font-semibold">
          {error.message}
        </div>
        <button
          type="button"
          onClick={clearError}
          className="text-xs font-semibold px-2 py-1 rounded-md bg-white/70 hover:bg-white"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
