'use client';
import React, { useState } from 'react';
// import VerseOfDay from './VerseOfDay'; // Keep VerseOfDay disabled for now
import HomePageBackground from './HomePageBackground';
import HomeHeader from './HomeHeader';
import HomeSearch from './HomeSearch';
import HomeTabs from './HomeTabs';

// FULL HOME PAGE RESTORED (except VerseOfDay)
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-foreground overflow-hidden">
      <HomePageBackground />

      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-4 sm:px-6 lg:px-8 homepage-scrollable-area">
        <HomeHeader />

        <main className="flex-grow flex flex-col items-center justify-center text-center pt-20 pb-10">
          <div className="content-visibility-auto animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-hero">
              The Noble Qur&apos;an
            </h2>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-content-secondary">
              Read! In the name of your Lord
            </p>
          </div>

          <HomeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* <VerseOfDay /> */}
          <div className="mt-12 w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl bg-surface-glass/60">
            <p className="text-center text-muted">Verse of Day temporarily disabled</p>
          </div>
        </main>

        <HomeTabs searchQuery={searchQuery} />
      </div>
    </div>
  );
}
