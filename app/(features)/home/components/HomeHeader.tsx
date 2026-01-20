'use client';
import { memo, useCallback } from 'react';

import { useTheme } from '@/app/providers/ThemeContext';
import { SunIcon, MoonIcon } from '@/app/shared/icons';
import { GlassCard } from '@/app/shared/ui';

interface HomeHeaderProps {
  className?: string;
}

/**
 * Header component for the home page with theme toggle functionality.
 * Implements mobile-first responsive design and performance optimization.
 */
export const HomeHeader = memo(function HomeHeader({ className }: HomeHeaderProps) {
  const { setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const nextTheme = html.classList.contains('dark') ? 'light' : 'dark';
    html.classList.toggle('dark', nextTheme === 'dark');
    html.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  }, [setTheme]);

  return (
    <header className={`w-full py-4 ${className || ''}`}>
      <div className="mx-auto w-full" style={{ maxWidth: 'clamp(20rem, 98vw, 90rem)' }}>
        <GlassCard variant="surface" size="comfortable" radius="xl">
          <nav className="flex justify-between items-center space-y-0">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold tracking-wider text-content-primary">
              Al Qur&apos;an
            </h1>
            <button
              onClick={toggleTheme}
              className="min-h-touch min-w-touch p-1.5 bg-button-secondary/40 rounded-full hover:bg-button-secondary-hover/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-manipulation flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              <span className="theme-toggle-icon--dark" aria-hidden="true">
                <SunIcon className="w-5 h-5 text-foreground" />
              </span>
              <span className="theme-toggle-icon--light" aria-hidden="true">
                <MoonIcon className="w-5 h-5 text-foreground" />
              </span>
            </button>
          </nav>
        </GlassCard>
      </div>
    </header>
  );
});
