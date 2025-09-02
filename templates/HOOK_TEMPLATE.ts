// Custom Hook Template - Copy this pattern for new hooks
// Replace: useExampleData, ExampleType, ExampleParams
// Location: app/(features)/[feature]/hooks/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import type { ExampleType, ErrorType } from '@/types';

interface UseExampleDataParams {
  id?: string;
  options?: ExampleOptions;
  enabled?: boolean;
}

interface ExampleOptions {
  pageSize?: number;
  sortBy?: string;
  filters?: Record<string, any>;
}

interface UseExampleDataReturn {
  data: ExampleType[];
  error: string | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for managing example data with the following features:
 * - Data fetching with error handling
 * - Pagination and infinite loading
 * - Integration with settings context
 * - Memoized results for performance
 * - Proper cleanup on unmount
 */
export function useExampleData({ 
  id, 
  options = {}, 
  enabled = true 
}: UseExampleDataParams): UseExampleDataReturn {
  // State
  const [data, setData] = useState<ExampleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Contexts
  const { settings } = useSettings();
  const { activeVerse } = useAudio();
  
  // Refs for cleanup and latest values
  const abortControllerRef = useRef<AbortController | null>(null);
  const isUnmountedRef = useRef(false);
  const latestDataRef = useRef(data);
  
  // Memoize options to prevent unnecessary re-fetches
  const stableOptions = useMemo(() => ({
    pageSize: options.pageSize || 20,
    sortBy: options.sortBy || 'default',
    filters: options.filters || {},
  }), [options.pageSize, options.sortBy, options.filters]);
  
  // Memoize processed data
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      // Apply settings-based transformations
      displayText: applySettings(item.text, settings),
    }));
  }, [data, settings]);
  
  // Memoize SWR key for stable caching
  const swrKey = useMemo(() => {
    if (!enabled || !id) return null;
    return `example-data-${id}-${JSON.stringify(stableOptions)}`;
  }, [enabled, id, stableOptions]);
  
  // Fetch function with error handling
  const fetchData = useCallback(async (
    page: number = 1, 
    append: boolean = false
  ): Promise<ExampleType[]> => {
    if (!id) return [];
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    try {
      const response = await fetch(`/api/example/${id}?page=${page}`, {
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Check if component unmounted during fetch
      if (isUnmountedRef.current) return [];
      
      const newData = result.data || [];
      setHasNextPage(result.hasNextPage || false);
      
      if (append) {
        setData(prev => [...prev, ...newData]);
      } else {
        setData(newData);
      }
      
      setError(null);
      return newData;
      
    } catch (err) {
      if (isUnmountedRef.current) return [];
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') return [];
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
      
      console.error('Fetch error:', err);
      return [];
    }
  }, [id]);
  
  // Main refetch function
  const refetch = useCallback(async () => {
    if (!enabled || !id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await fetchData(1, false);
    } finally {
      if (!isUnmountedRef.current) {
        setIsLoading(false);
        setCurrentPage(1);
      }
    }
  }, [enabled, id, fetchData]);
  
  // Load more function for pagination
  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading || isValidating || !id) return;
    
    setIsValidating(true);
    
    try {
      await fetchData(currentPage + 1, true);
      setCurrentPage(prev => prev + 1);
    } finally {
      if (!isUnmountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [hasNextPage, isLoading, isValidating, id, currentPage, fetchData]);
  
  // Reset function
  const reset = useCallback(() => {
    setData([]);
    setError(null);
    setIsLoading(false);
    setIsValidating(false);
    setHasNextPage(true);
    setCurrentPage(1);
  }, []);
  
  // Navigation helpers (for audio integration)
  const getNextItem = useCallback(() => {
    if (!activeVerse) return null;
    const currentIndex = data.findIndex(item => item.id === activeVerse.id);
    return currentIndex < data.length - 1 ? data[currentIndex + 1] : null;
  }, [activeVerse, data]);
  
  const getPreviousItem = useCallback(() => {
    if (!activeVerse) return null;
    const currentIndex = data.findIndex(item => item.id === activeVerse.id);
    return currentIndex > 0 ? data[currentIndex - 1] : null;
  }, [activeVerse, data]);
  
  // Initial fetch effect
  useEffect(() => {
    if (enabled && id && data.length === 0 && !isLoading) {
      refetch();
    }
  }, [enabled, id, data.length, isLoading, refetch]);
  
  // Settings change effect (optional - only if data depends on settings)
  useEffect(() => {
    if (data.length > 0) {
      // Re-process data when settings change
      latestDataRef.current = processedData;
    }
  }, [processedData]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Update ref for latest data
  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  return {
    data: processedData,
    error,
    isLoading,
    isValidating,
    refetch,
    hasNextPage,
    loadMore,
    reset,
    // Additional helpers
    getNextItem,
    getPreviousItem,
  } as const;
}

export default useExampleData;