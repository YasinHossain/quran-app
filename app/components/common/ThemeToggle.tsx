'use client';
import { useTheme } from '@/app/context/ThemeContext';
import { Sun, Moon } from './SvgIcons';
import React from 'react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const icon = theme === 'light' ? (
    <Moon className="w-5 h-5 text-slate-700" />
  ) : (
    <Sun className="w-5 h-5 text-yellow-400" />
  );

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`p-2 bg-white/40 dark:bg-white/10 rounded-full hover:bg-white/60 dark:hover:bg-white/20 transition-colors ${className}`}
    >
      {icon}
    </button>
  );
}
