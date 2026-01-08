'use client';

/**
 * Client-side interactive tabs component.
 * Handles tab switching and search filtering.
 * The initial Surah grid is already rendered by the server.
 */

import React, { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';

import { SurahTab } from './SurahTab';
import { TabNavigation } from './TabNavigation';

import type { Chapter } from '@/types';

interface HomeTabsClientProps {
    searchQuery?: string;
    /** Pre-fetched chapters from server */
    initialChapters: ReadonlyArray<Chapter>;
    /** Server-rendered Surah grid (shown initially) */
    children?: React.ReactNode;
}

const JuzTab = dynamic(() => import('./JuzTab').then((mod) => ({ default: mod.JuzTab })), {
    loading: () => <JuzTabSkeleton />,
});

function JuzTabSkeleton(): React.JSX.Element {
    return (
        <div className="grid w-full auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 30 }, (_, i) => (
                <div
                    key={i}
                    className="h-20 rounded-xl bg-surface-navigation/50 animate-pulse"
                />
            ))}
        </div>
    );
}

export function HomeTabsClient({
    searchQuery = '',
    initialChapters,
    children,
}: HomeTabsClientProps): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<'Surah' | 'Juz'>('Surah');
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Track if user has interacted with tabs
    const handleTabChange = useCallback((tab: 'Surah' | 'Juz') => {
        setActiveTab(tab);
    }, []);

    // Determine what to render
    const shouldShowServerGrid = activeTab === 'Surah' && !searchQuery.trim();

    return (
        <section id="surahs" className="py-16 sm:py-20 max-w-screen-2xl mx-auto w-full px-2 sm:px-3">
            <div className="flex justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-content-primary truncate min-w-0 flex-shrink">
                    {activeTab === 'Surah' ? 'All Surahs' : 'All Juz'}
                </h2>
                <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Content: Show server-rendered grid or client-rendered content */}
            {activeTab === 'Surah' ? (
                shouldShowServerGrid && children ? (
                    // Use server-rendered grid when no search/filter is active
                    children
                ) : (
                    // Use client-rendered grid with filtering
                    <SurahTab searchQuery={searchQuery} initialChapters={initialChapters} />
                )
            ) : (
                <Suspense fallback={<JuzTabSkeleton />}>
                    <JuzTab />
                </Suspense>
            )}
        </section>
    );
}
