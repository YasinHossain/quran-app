'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getItem, setItem } from '@/lib/utils/safeLocalStorage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provides global color theme state.
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
  // Initialize theme with a default value or provided value
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // Effect to load theme from localStorage on the client side after initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored as Theme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect to save theme to localStorage and toggle the dark class whenever theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setItem('theme', theme);
      // Ensure the dark class is toggled for Tailwind's class strategy
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.cookie = `theme=${theme}; path=/; max-age=31536000`;
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

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
