/**
 * React Hook: useThemeService
 *
 * Provides access to ThemeService with React integration.
 * This replaces the need for the existing ThemeContext pattern.
 */

import { useState, useCallback, useEffect } from 'react';
import { ThemeService } from '../services/ThemeService';
import { getServices } from '../ServiceContainer';
import { Theme, ThemeMode, ResolvedTheme } from '../../domain/entities/Theme';

export interface UseThemeServiceResult {
  // Current theme state
  theme: Theme | null;
  resolvedTheme: ResolvedTheme;
  loading: boolean;
  error: string | null;

  // Theme operations
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<ResolvedTheme>;

  // Theme queries
  getCurrentMode: () => Promise<ThemeMode>;
  isSystemMode: () => Promise<boolean>;
  isDarkMode: () => Promise<boolean>;

  // Utility operations
  resetToDefaults: () => Promise<void>;
  refreshTheme: () => Promise<void>;
}

export function useThemeService(): UseThemeServiceResult {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeService: ThemeService = getServices().themeService;

  // Load initial theme
  const refreshTheme = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentTheme = await themeService.getTheme();
      const resolved = currentTheme.resolveTheme();

      setThemeState(currentTheme);
      setResolvedTheme(resolved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load theme');
    } finally {
      setLoading(false);
    }
  }, [themeService]);

  // Initialize on mount
  useEffect(() => {
    refreshTheme();
  }, [refreshTheme]);

  // Theme operations
  const setTheme = useCallback(
    async (mode: ThemeMode) => {
      try {
        setError(null);
        await themeService.setTheme(mode);
        await refreshTheme();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update theme');
        throw err;
      }
    },
    [themeService, refreshTheme]
  );

  const toggleTheme = useCallback(async () => {
    try {
      setError(null);
      const newResolvedTheme = await themeService.toggleTheme();
      await refreshTheme();
      return newResolvedTheme;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle theme');
      throw err;
    }
  }, [themeService, refreshTheme]);

  // Theme queries
  const getCurrentMode = useCallback(async () => {
    try {
      return await themeService.getCurrentMode();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current mode');
      throw err;
    }
  }, [themeService]);

  const isSystemMode = useCallback(async () => {
    try {
      return await themeService.isSystemMode();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check system mode');
      throw err;
    }
  }, [themeService]);

  const isDarkMode = useCallback(async () => {
    try {
      return await themeService.isDarkMode();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check dark mode');
      throw err;
    }
  }, [themeService]);

  // Utility operations
  const resetToDefaults = useCallback(async () => {
    try {
      setError(null);
      await themeService.resetToDefaults();
      await refreshTheme();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset theme');
      throw err;
    }
  }, [themeService, refreshTheme]);

  return {
    // State
    theme,
    resolvedTheme,
    loading,
    error,

    // Theme operations
    setTheme,
    toggleTheme,

    // Theme queries
    getCurrentMode,
    isSystemMode,
    isDarkMode,

    // Utility operations
    resetToDefaults,
    refreshTheme,
  };
}
