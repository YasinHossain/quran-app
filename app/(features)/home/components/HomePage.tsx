'use client';
import React, { useState } from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import VerseOfDay from './VerseOfDay';
import HomePageBackground from './HomePageBackground';
import HomeHeader from './HomeHeader';
import HomeSearch from './HomeSearch';
import HomeTabs from './HomeTabs';

// --- Main Page Component ---
/**
 * Home page for the Qur'an application.
 *
 * Features:
 * - Search bar for filtering Surahs, Juz, and pages.
 * - Tab navigation to switch between Surah, Juz, and Page views.
 * - Theme toggle to switch between light and dark modes.
 *
 * Internal state:
 * - `searchQuery` stores the user's search input.
 * - `theme` is managed via `useTheme`.
 */
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  return (
    <div
      className={`relative h-screen flex flex-col ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-transparent dark:text-[var(--foreground)]'} overflow-hidden`}
    >
      <HomePageBackground />

      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-4 sm:px-6 lg:px-8 homepage-scrollable-area">
        <HomeHeader />

        <main className="flex-grow flex flex-col items-center justify-center text-center pt-20 pb-10">
          <div className="content-visibility-auto animate-fade-in-up">
            <h2
              className={`text-5xl md:text-7xl font-bold tracking-tight ${theme === 'light' ? 'text-slate-800' : 'bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400'}`}
            >
              The Noble Qur&apos;an
            </h2>
            <p
              className={`mt-4 text-lg md:text-xl max-w-2xl mx-auto ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
            >
              Read! In the name of your Lord
            </p>
          </div>

          <HomeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <VerseOfDay />
        </main>

        <HomeTabs searchQuery={searchQuery} />
      </div>
    </div>
  );
}
