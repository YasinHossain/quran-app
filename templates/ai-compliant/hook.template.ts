/**
 * MANDATORY Architecture-Compliant Hook Template
 * 
 * This template MUST be followed exactly for ALL custom hooks.
 * Failure to follow this pattern violates project architecture.
 * 
 * Usage: Copy this template and replace useHookName with your hook name
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import type { HookData, HookOptions, HookResult } from '@/types';

interface UseHookNameParams {
  id: string;
  options?: HookOptions;
  initialData?: HookData;
}

/**
 * @description Custom hook for [specific purpose and behavior]
 * @param params Hook parameters
 * @returns Hook result with data, loading state, and actions
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch, reset } = useHookName({ 
 *   id: 'example-id',
 *   options: { cache: true }
 * });
 * ```
 */
export function useHookName({ 
  id, 
  options,
  initialData 
}: UseHookNameParams): HookResult {
  // ✅ State management
  const [data, setData] = useState<HookData | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  
  // ✅ REQUIRED: Context integration where applicable
  const { settings } = useSettings();
  
  // ✅ Refs for cleanup and persistence
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = options?.maxRetries ?? 3;

  // ✅ REQUIRED: Memoize derived values and expensive computations
  const processedData = useMemo(() => {
    if (!data) return null;
    
    return transformHookData(data, settings);
  }, [data, settings]);

  const isRetryable = useMemo(() => {
    return error && retryCountRef.current < maxRetries;
  }, [error, maxRetries]);

  const cacheKey = useMemo(() => {
    return options?.cache ? `hook-${id}-${JSON.stringify(options)}` : null;
  }, [id, options]);

  // ✅ REQUIRED: Memoize all callbacks
  const fetchData = useCallback(async (retryCount = 0) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    retryCountRef.current = retryCount;

    try {
      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Check cache first if enabled
      if (cacheKey && retryCount === 0) {
        const cached = getCachedData(cacheKey);
        if (cached && !options?.forceRefresh) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      const result = await apiCall(id, options, {
        signal: abortControllerRef.current.signal,
      });

      setData(result);
      
      // Cache the result if caching is enabled
      if (cacheKey) {
        setCachedData(cacheKey, result);
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        
        // Log error for debugging
        console.error(`useHookName fetch error for ${id}:`, err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, options, cacheKey]);

  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchData(0);
  }, [fetchData]);

  const retry = useCallback(() => {
    if (isRetryable) {
      fetchData(retryCountRef.current + 1);
    }
  }, [fetchData, isRetryable]);

  const reset = useCallback(() => {
    setData(initialData || null);
    setError(null);
    setIsLoading(false);
    retryCountRef.current = 0;
    
    // Clear cache if applicable
    if (cacheKey) {
      clearCachedData(cacheKey);
    }
  }, [initialData, cacheKey]);

  const updateData = useCallback((updater: (prevData: HookData | null) => HookData | null) => {
    setData(updater);
  }, []);

  // ✅ REQUIRED: Proper effects with cleanup
  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Settings change effect (if hook depends on settings)
  useEffect(() => {
    if (data && settings) {
      // Re-process data when settings change
      // This is already handled by the processedData memo,
      // but you might need to refetch if settings affect the API call
      if (options?.refreshOnSettingsChange) {
        refetch();
      }
    }
  }, [settings, data, options?.refreshOnSettingsChange, refetch]);

  // ✅ REQUIRED: Return object with 'as const' for better type inference
  return {
    // Data
    data: processedData,
    rawData: data,
    
    // State
    isLoading,
    error,
    isRetryable,
    retryCount: retryCountRef.current,
    
    // Actions
    refetch,
    retry,
    reset,
    updateData,
  } as const;
}

// Helper functions (keep within file for better encapsulation)
function getCachedData(key: string): HookData | null {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedData(key: string, data: HookData): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Fail silently for localStorage issues
  }
}

function clearCachedData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Fail silently for localStorage issues
  }
}

function transformHookData(data: HookData, settings: any): HookData {
  // Transform data based on settings
  // This is where you'd apply user preferences, formatting, etc.
  return data;
}

function apiCall(id: string, options: HookOptions | undefined, config: { signal: AbortSignal }): Promise<HookData> {
  // Implement your API call here
  // This is just a placeholder
  return fetch(`/api/data/${id}`, {
    signal: config.signal,
    ...options?.fetchOptions,
  }).then(res => res.json());
}

// ✅ REQUIRED: Both named and default exports
export { useHookName };
export default useHookName;