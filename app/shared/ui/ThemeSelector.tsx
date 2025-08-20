'use client';

import React from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import { SunIcon, MoonIcon } from '@/app/shared/icons';

interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { setTheme } = useTheme();

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 bg-button-secondary/40 rounded-full hover:bg-button-secondary-hover/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className || ''}`}
      aria-label="Toggle Theme"
    >
      <div className="dark:hidden">
        <MoonIcon className="w-5 h-5 text-content-secondary" />
      </div>
      <div className="hidden dark:block">
        <SunIcon className="w-5 h-5 text-status-warning" />
      </div>
    </button>
  );
};
