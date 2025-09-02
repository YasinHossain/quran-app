// Context Provider Template - Copy this pattern for new contexts
// Replace: Example, ExampleSettings, example-settings
// Location: app/providers/

'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { ExampleSettings } from '@/types';
import { defaultSettings, loadSettings, saveSettings } from './exampleStorage';
import { reducer } from './exampleReducer';

// Debounce interval for localStorage persistence
const PERSIST_DEBOUNCE_MS = 300;

interface ExampleContextType {
  settings: ExampleSettings;
  setSettings: (settings: ExampleSettings) => void;
  
  // Specific action methods for common operations
  updateSetting: <K extends keyof ExampleSettings>(
    key: K, 
    value: ExampleSettings[K]
  ) => void;
  resetSettings: () => void;
  
  // Additional state/actions based on context needs
  isLoading: boolean;
  error: string | null;
}

const ExampleContext = createContext<ExampleContextType | undefined>(undefined);

/**
 * Provides global access to example settings and state.
 * 
 * Features:
 * - Persistent storage with debouncing
 * - Type-safe setting updates
 * - Error handling for storage operations
 * - Cleanup on unmount
 */
export const ExampleProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings, loadSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for debouncing and cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSettings = useRef(settings);
  const isUnmountedRef = useRef(false);

  // Update latest settings ref
  useEffect(() => {
    latestSettings.current = settings;
  }, [settings]);

  // Debounced persistence to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || isUnmountedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      try {
        saveSettings(settings);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
        setError(errorMessage);
        console.error('Settings save error:', err);
      } finally {
        timeoutRef.current = null;
      }
    }, PERSIST_DEBOUNCE_MS);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [settings]);

  // Flush pending writes on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      
      if (typeof window === 'undefined') return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        try {
          saveSettings(latestSettings.current);
        } catch (err) {
          console.error('Failed to save settings on unmount:', err);
        }
      }
    };
  }, []);

  // Memoized action methods
  const setSettings = useCallback(
    (newSettings: ExampleSettings) => {
      dispatch({ type: 'SET_SETTINGS', value: newSettings });
    },
    []
  );

  const updateSetting = useCallback(
    <K extends keyof ExampleSettings>(key: K, value: ExampleSettings[K]) => {
      dispatch({ type: 'UPDATE_SETTING', key, value });
    },
    []
  );

  const resetSettings = useCallback(() => {
    dispatch({ type: 'RESET_SETTINGS' });
  }, []);

  // Additional actions based on context needs
  const performAsyncAction = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Perform async operation
      const result = await someAsyncOperation(data);
      dispatch({ type: 'SET_ASYNC_RESULT', value: result });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      console.error('Async action error:', err);
    } finally {
      if (!isUnmountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      settings,
      setSettings,
      updateSetting,
      resetSettings,
      performAsyncAction,
      isLoading,
      error,
    }),
    [
      settings,
      setSettings,
      updateSetting,
      resetSettings,
      performAsyncAction,
      isLoading,
      error,
    ]
  );

  return (
    <ExampleContext.Provider value={value}>
      {children}
    </ExampleContext.Provider>
  );
};

/**
 * Hook to access example context.
 * Must be used within ExampleProvider.
 */
export const useExample = () => {
  const context = useContext(ExampleContext);
  if (!context) {
    throw new Error('useExample must be used within ExampleProvider');
  }
  return context;
};

// Optional: Selector hook for performance optimization
export const useExampleSelector = <T>(
  selector: (settings: ExampleSettings) => T
) => {
  const { settings } = useExample();
  return useMemo(() => selector(settings), [settings, selector]);
};

export default ExampleProvider;