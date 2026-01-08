'use client';

/**
 * Client-side Home Page component.
 * Handles all interactive features while leveraging server-rendered content.
 */

import { memo } from 'react';

import { HomeHeader } from './HomeHeader';
import { HomePageBackground } from './HomePageBackground';
import { HomeSearch } from './HomeSearch';
import { HomeTabsClient } from './HomeTabsClient';
import { VerseOfDay } from './VerseOfDay';

import type { Chapter, Verse } from '@/types';

interface HomePageClientProps {
    className?: string;
    /** Pre-fetched chapters from server */
    initialChapters: ReadonlyArray<Chapter>;
    /** Pre-fetched verse of the day from server */
    initialVerse?: Verse | undefined;
    /** Server-rendered Surah grid (children) */
    children?: React.ReactNode;
}

/**
 * Client-side home page with mobile-first responsive design.
 *
 * Features:
 * - Comprehensive search functionality with instant results
 * - Tab navigation between different content views
 * - Verse of the Day display
 * - Theme toggle functionality
 *
 * Architecture compliance:
 * - Uses memo() for performance optimization
 * - Implements mobile-first responsive design
 * - Accepts server-rendered children for instant content display
 */
export const HomePageClient = memo(function HomePageClient({
    className,
    initialChapters,
    initialVerse,
    children,
}: HomePageClientProps) {
    return (
        <div
            className={`relative min-h-[100dvh] flex flex-col bg-background text-foreground ${className || ''}`}
        >
            <HomePageBackground />

            <div className="relative z-10 flex flex-col px-2 sm:px-4 pb-24 md:px-6 md:pb-10 lg:px-8">
                <HomeHeader />

                <main className="flex-grow flex flex-col items-center justify-center text-center space-y-6 pt-6 pb-6 md:pt-12 md:pb-10 md:space-y-8">
                    {/* Title - scales with content */}
                    <div className="content-visibility-auto animate-fade-in-up mb-4 md:mb-6">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                            Al Qur&apos;an
                        </h2>
                    </div>

                    {/* Search bar - Third widest */}
                    <div
                        className="w-full mx-auto animate-fade-in-up animation-delay-200"
                        style={{ maxWidth: 'clamp(16rem, 70vw, 44rem)' }}
                    >
                        <HomeSearch />
                    </div>

                    {/* Verse of the Day - Second widest (wider than search) */}
                    <div
                        className="w-full mx-auto animate-fade-in-up animation-delay-400"
                        style={{ maxWidth: 'clamp(18rem, 80vw, 64rem)' }}
                    >
                        <VerseOfDay initialVerse={initialVerse} />
                    </div>
                </main>

                {/* Tabs section with server-rendered grid as children */}
                <HomeTabsClient initialChapters={initialChapters}>
                    {children}
                </HomeTabsClient>
            </div>
        </div>
    );
});
