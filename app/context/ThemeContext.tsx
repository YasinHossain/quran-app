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
  // The initialTheme is required and comes from the server-side layout.
  initialTheme: Theme;
}) => {
  // Initialize the theme state with the value provided by the server.
  // This is the correct way to prevent client/server mismatches.
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // This effect runs whenever the theme state changes (e.g., when the user clicks the button).
  // It updates the class on the <html> element, localStorage, and cookies.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use classList.toggle for a cleaner way to add/remove the 'dark' class.
      document.documentElement.classList.toggle('dark', theme === 'dark');
      
      // Persist the new theme choice for future visits.
      localStorage.setItem('theme', theme);
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
