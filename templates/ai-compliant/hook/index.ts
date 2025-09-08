/**
 * MANDATORY Architecture-Compliant Hook Template
 *
 * Usage: Copy this template and replace useHookName with your hook name.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  apiCall,
  clearCachedData,
  getCachedData,
  setCachedData,
  transformHookData,
} from './helpers';
import { useSettings } from '@/templates/ai-compliant/shared/contexts';

import type { HookData, HookOptions, HookResult } from '@/types';

interface UseHookNameParams {
  id: string;
  options?: HookOptions;
  initialData?: HookData;
}

export function useHookName({
  id,
  options,
  initialData,
}: UseHookNameParams): HookResult {
  const [data, setData] = useState<HookData | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);

  const { settings } = useSettings();

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = options?.maxRetries ?? 3;

  const processedData = useMemo(
    () => (data ? transformHookData(data, settings) : null),
    [data, settings],
  );

  const isRetryable = useMemo(
    () => !!error && retryCountRef.current < maxRetries,
    [error, maxRetries],
  );

  const cacheKey = useMemo(
    () => (options?.cache ? `hook-${id}-${JSON.stringify(options)}` : null),
    [id, options],
  );

  const fetchData = useCallback(
    async (retryCount = 0) => {
      if (!id) return;

      setIsLoading(true);
      setError(null);
      retryCountRef.current = retryCount;

      try {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

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

        if (cacheKey) setCachedData(cacheKey, result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [id, options, cacheKey],
  );

  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchData(0);
  }, [fetchData]);

  const retry = useCallback(() => {
    if (isRetryable) fetchData(retryCountRef.current + 1);
  }, [fetchData, isRetryable]);

  const reset = useCallback(() => {
    setData(initialData || null);
    setError(null);
    setIsLoading(false);
    retryCountRef.current = 0;
    if (cacheKey) clearCachedData(cacheKey);
  }, [initialData, cacheKey]);

  const updateData = useCallback(
    (updater: (prev: HookData | null) => HookData | null) => {
      setData(updater);
    },
    [],
  );

  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  useEffect(() => {
    if (data && settings && options?.refreshOnSettingsChange) {
      refetch();
    }
  }, [settings, data, options?.refreshOnSettingsChange, refetch]);

  return {
    data: processedData,
    rawData: data,
    isLoading,
    error,
    isRetryable,
    retryCount: retryCountRef.current,
    refetch,
    retry,
    reset,
    updateData,
  } as const;
}

export { useHookName };
export default useHookName;
