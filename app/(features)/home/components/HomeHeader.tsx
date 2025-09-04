'use client';
import { memo, useCallback } from 'react';

import { SunIcon, MoonIcon } from '@/app/shared/icons';
import { GlassCard } from '@/app/shared/ui';
import { useTheme } from '@/app/providers/ThemeContext';

interface HomeHeaderProps {
  className?: string;
}

/**
 * Header component for the home page with theme toggle functionality.
 * Implements mobile-first responsive design and performance optimization.
 */
export const HomeHeader = memo(function HomeHeader({ className }: HomeHeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  }, [setTheme]);

  return (
    <header className={`w-full p-4 md:py-4 md:px-0 ${className || ''}`}>
      <GlassCard
        variant="surface"
        size="comfortable"
        radius="xl"
        className="max-w-screen-2xl mx-auto"
      >
        <nav className="flex justify-between items-center space-y-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-content-primary">
            Al Qur&apos;an
          </h1>
          <button
            onClick={toggleTheme}
            className="min-h-11 min-w-11 p-2 bg-button-secondary/40 rounded-full hover:bg-button-secondary-hover/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-manipulation"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5 text-status-warning" />
            ) : (
              <MoonIcon className="w-5 h-5 text-content-secondary" />
            )}
          </button>
        </nav>
      </GlassCard>
    </header>
  );
});
