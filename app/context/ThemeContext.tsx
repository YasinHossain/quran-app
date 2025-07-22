'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) => {
  // Initialize theme with a default value or provided initial theme
  const [theme, setTheme] = useState<Theme>(initialTheme ?? 'light');

  // Effect to load theme from localStorage on the client side after initial render
  useEffect(() => {
    if (typeof window !== 'undefined' && initialTheme === undefined) {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored as Theme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }
  }, [initialTheme]); // Run once on mount unless initialTheme changes

  // Effect to save theme to localStorage and update data attribute whenever theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.dataset.theme = theme;
      document.cookie = `theme=${theme}; path=/; max-age=31536000`;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
