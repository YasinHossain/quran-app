'use client';

import React from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from './Button';

interface ThemeToggleProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'tabs' | string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'ghost', className }) => {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');
  }, []);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  // Tab-style variant
  if (variant === 'tabs') {
    return (
      <div
        className={`flex items-center p-1 rounded-full bg-interactive border border-border ${className || ''}`}
      >
        <button
          onClick={() => handleThemeChange('light')}
          className={`flex items-center justify-center px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
            currentTheme === 'light'
              ? 'bg-surface shadow text-foreground'
              : 'text-muted hover:text-foreground hover:bg-surface/50'
          }`}
          aria-label="Light theme"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center justify-center px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
            currentTheme === 'dark'
              ? 'bg-surface shadow text-foreground'
              : 'text-muted hover:text-foreground hover:bg-surface/50'
          }`}
          aria-label="Dark theme"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Original button style for backward compatibility
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="icon-round"
      size="icon"
      onClick={toggleTheme}
      className={`bg-button-secondary/40 hover:bg-button-secondary-hover/60 ${className || ''}`}
      aria-label="Toggle Theme"
    >
      {currentTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-status-warning" />
      ) : (
        <Moon className="w-5 h-5 text-content-secondary" />
      )}
    </Button>
  );
};
