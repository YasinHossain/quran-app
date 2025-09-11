/**
 * MANDATORY Architecture-Compliant Hook Template
 *
 * Usage: Copy this template and replace useHookName with your hook name.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSettings } from '@/templates/ai-compliant/shared/contexts';

import {
  apiCall,
  clearCachedData,
  getCachedData,
  setCachedData,
  transformHookData,
} from './helpers';

import type { HookData, HookOptions, HookResult } from '@/types';

interface UseHookNameParams {
  id: string;
  options?: HookOptions;
  initialData?: HookData;
}

const buildCacheKey = (id: string, options?: HookOptions | undefined): string | null =>
  options?.cache ? `hook-${id}-${JSON.stringify(options)}` : null;

const tryReadFromCache = (cacheKey: string | null, forceRefresh?: boolean): HookData | null => {
  if (!cacheKey || forceRefresh) return null;
  const cached = getCachedData(cacheKey);
  return cached || null;
};

function useHookState(initialData?: HookData): { data: HookData | null; setData: React.Dispatch<React.SetStateAction<HookData | null>>; error: string | null; setError: React.Dispatch<React.SetStateAction<string | null>>; isLoading: boolean; setIsLoading: React.Dispatch<React.SetStateAction<boolean>> } {
  const [data, setData] = useState<HookData | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  return { data, setData, error, setError, isLoading, setIsLoading };
}

function useHookRefs(maxRetries: number): { abortControllerRef: React.MutableRefObject<AbortController | null>; retryCountRef: React.MutableRefObject<number>; maxRetries: number } {
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  return { abortControllerRef, retryCountRef, maxRetries };
}

type HookStateApi = ReturnType<typeof useHookState>;
type HookRefsApi = ReturnType<typeof useHookRefs>;

interface MemoInputs {
  data: HookData | null;
  settings: unknown;
  error: string | null;
}

interface CacheConfig {
  id: string;
  options?: HookOptions;
}

interface RetryConfig {
  current: number;
  max: number;
}

function useHookMemo(
  inputs: MemoInputs,
  cache: CacheConfig,
  retry: RetryConfig,
): { processedData: HookData | null; isRetryable: boolean; cacheKey: string | null } {
  const { data, settings, error } = inputs;
  const { id, options } = cache;
  const processedData = useMemo(() => (data ? transformHookData(data, settings) : null), [data, settings]);
  const isRetryable = !!error && retry.current < retry.max;
  const cacheKey = useMemo(() => buildCacheKey(id, options), [id, options]);
  return { processedData, isRetryable, cacheKey };
}

interface CallbackCtx {
  id: string;
  options?: HookOptions;
  cacheKey: string | null;
  state: HookStateApi;
  refs: HookRefsApi;
  initialData?: HookData;
}

const beginRequest = (state: HookStateApi, refs: HookRefsApi, retryCount: number): AbortSignal => {
  state.setIsLoading(true);
  state.setError(null);
  refs.retryCountRef.current = retryCount;
  refs.abortControllerRef.current?.abort();
  refs.abortControllerRef.current = new AbortController();
  return refs.abortControllerRef.current.signal;
};

const getCachedIfAvailable = (
  cacheKey: string | null,
  options: HookOptions | undefined,
  retryCount: number,
): HookData | null => (retryCount === 0 ? tryReadFromCache(cacheKey, options?.forceRefresh) : null);

const setResult = (state: HookStateApi, cacheKey: string | null, result: HookData): void => {
  state.setData(result);
  if (cacheKey) setCachedData(cacheKey, result);
};

const normalizeError = (err: unknown): string | null => {
  const e = err as { name?: string; message?: string } | Error | undefined;
  if (e && (e as Error).name === 'AbortError') return null;
  return e instanceof Error ? e.message : 'Unknown error';
};

function useHookCallbacks(ctx: CallbackCtx): {
  fetchData: (retryCount?: number) => Promise<void>;
  refetch: () => void;
  retry: () => void;
  reset: () => void;
  updateData: (updater: (prev: HookData | null) => HookData | null) => void;
} {
  const { id, options, cacheKey, state, refs, initialData } = ctx;

  const fetchData = useCallback(async (retryCount = 0) => {
    if (!id) return;
    const signal = beginRequest(state, refs, retryCount);
    try {
      const cached = getCachedIfAvailable(cacheKey, options, retryCount);
      if (cached) {
        state.setData(cached);
        return;
      }
      const result = await apiCall(id, options, { signal });
      setResult(state, cacheKey, result);
    } catch (err: unknown) {
      const message = normalizeError(err);
      if (message) state.setError(message);
    } finally {
      state.setIsLoading(false);
    }
  }, [id, options, cacheKey, state, refs]);

  const refetch = useCallback(() => {
    refs.retryCountRef.current = 0;
    fetchData(0);
  }, [fetchData, refs]);

  const retry = useCallback(() => {
    const isRetryable = !!state.error && refs.retryCountRef.current < refs.maxRetries;
    if (isRetryable) fetchData(refs.retryCountRef.current + 1);
  }, [fetchData, state.error, refs]);

  const reset = useCallback(() => {
    state.setData(initialData || null);
    state.setError(null);
    state.setIsLoading(false);
    refs.retryCountRef.current = 0;
    if (cacheKey) clearCachedData(cacheKey);
  }, [initialData, cacheKey, state, refs]);

  const updateData = useCallback((updater: (prev: HookData | null) => HookData | null) => {
    state.setData(updater);
  }, [state]);

  return { fetchData, refetch, retry, reset, updateData };
}

export function useHookName({ id, options, initialData }: UseHookNameParams): HookResult {
  const state = useHookState(initialData);
  const { settings } = useSettings();
  const refs = useHookRefs(options?.maxRetries ?? 3);
  const memoized = useHookMemo(
    { data: state.data, settings, error: state.error },
    { id, options },
    { current: refs.retryCountRef.current, max: refs.maxRetries },
  );
  const callbacks = useHookCallbacks({ id, options, cacheKey: memoized.cacheKey, state, refs, initialData });
  const { fetchData, refetch } = callbacks;

  // Fetch on mount and when inputs change
  useEffect(() => { fetchData(0); }, [fetchData]);
  // Abort in-flight request on unmount
  useEffect(() => () => refs.abortControllerRef.current?.abort(), [refs.abortControllerRef]);
  // Refetch when settings change if enabled
  useEffect(() => { 
    if (state.data && settings && options?.refreshOnSettingsChange) refetch(); 
  }, [settings, state.data, options?.refreshOnSettingsChange, refetch]);

  return { 
    data: memoized.processedData, 
    rawData: state.data, 
    isLoading: state.isLoading, 
    error: state.error, 
    isRetryable: memoized.isRetryable, 
    retryCount: refs.retryCountRef.current, 
    ...callbacks 
  } as const;
}

export { useHookName };
export default useHookName;
