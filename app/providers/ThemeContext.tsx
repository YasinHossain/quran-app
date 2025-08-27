'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { useThemeService } from '@/src/application/hooks/useThemeService';
import { ResolvedTheme, ThemeMode } from '@/src/domain/entities/Theme';

export type Theme = ResolvedTheme; // For backward compatibility

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<ResolvedTheme>;
  loading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provides global color theme state using clean architecture services.
 * Wrap your app with this provider to share and persist the current
 * light or dark theme preference across components.
 */
export const ThemeProvider = ({
  children,
  initialTheme = 'light',
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) => {
  const themeService = useThemeService();

  const value = useMemo(
    () => ({
      theme: themeService.resolvedTheme,
      setTheme: themeService.setTheme,
      toggleTheme: themeService.toggleTheme,
      loading: themeService.loading,
      error: themeService.error,
    }),
    [themeService]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook for accessing and updating the theme.
 * Use inside components to read or change the current theme managed by
 * `ThemeProvider`.
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
