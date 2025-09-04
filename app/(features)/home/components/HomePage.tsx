'use client';
import { memo, useCallback, useState } from 'react';

import VerseOfDay from './VerseOfDay';
import HomePageBackground from './HomePageBackground';
import { HomeHeader } from './HomeHeader';
import { HomeSearch } from './HomeSearch';
import { HomeTabs } from './HomeTabs';

interface HomePageProps {
  className?: string;
}

/**
 * Home page for the Qur'an application with mobile-first responsive design.
 *
 * Features:
 * - Search functionality for Surahs, Juz, and Pages
 * - Tab navigation between different content views
 * - Verse of the Day display
 * - Theme toggle functionality
 *
 * Architecture compliance:
 * - Uses memo() for performance optimization
 * - Implements mobile-first responsive design
 * - Includes proper TypeScript interfaces
 */
export const HomePage = memo(function HomePage({ className }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div
      className={`relative min-h-[100dvh] flex flex-col bg-background text-foreground overflow-hidden ${className || ''}`}
    >
      <HomePageBackground />

      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-4 md:px-6 lg:px-8 homepage-scrollable-area">
        <HomeHeader />

        <main className="flex-grow flex flex-col items-center justify-center text-center space-y-8 pt-12 pb-6 md:pt-20 md:pb-10 md:space-y-12">
          <div className="content-visibility-auto animate-fade-in-up space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-hero leading-tight">
              The Noble Qur&apos;an
            </h2>
            <p className="text-base md:text-lg lg:text-xl max-w-xl md:max-w-2xl mx-auto text-content-secondary px-4 md:px-0">
              Read! In the name of your Lord
            </p>
          </div>

          <HomeSearch searchQuery={searchQuery} setSearchQuery={handleSearchChange} />

          <VerseOfDay />
        </main>

        <HomeTabs searchQuery={searchQuery} />
      </div>
    </div>
  );
});
