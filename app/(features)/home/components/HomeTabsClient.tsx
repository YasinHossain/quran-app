'use client';

/**
 * Client-side interactive tabs component.
 * Handles tab switching and search filtering.
 * The initial Surah grid is already rendered by the server.
 */

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { useIdleViewportPrefetch } from '@/app/shared/navigation/hooks/useIdleViewportPrefetch';

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
        <div key={i} className="h-20 rounded-xl bg-surface-navigation/50 animate-pulse" />
      ))}
    </div>
  );
}

const SURAH_HREF_MATCH = /\/surah\/\d+/;

export function HomeTabsClient({
  searchQuery = '',
  initialChapters,
  children,
}: HomeTabsClientProps): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');
  const surahContainerRef = useRef<HTMLDivElement | null>(null);

  // Track if user has interacted with tabs
  const handleTabChange = useCallback((tab: 'surah' | 'juz') => {
    setActiveTab(tab);
  }, []);

  // Determine what to render
  const shouldShowServerGrid = activeTab === 'surah' && !searchQuery.trim();

  const prefetch = useCallback((href: string) => router.prefetch(href), [router]);

  useIdleViewportPrefetch({
    enabled: activeTab === 'surah',
    containerRef: surahContainerRef,
    prefetch,
    hrefMatch: SURAH_HREF_MATCH,
    delayMs: 2500,
    limit: 8,
  });

  return (
    <section
      id="surahs"
      className="pt-4 sm:pt-5 pb-6 sm:pb-8 max-w-screen-2xl mx-auto w-full px-2 sm:px-3"
    >
      <div className="flex justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-content-primary truncate min-w-0 flex-shrink">
          {activeTab === 'surah' ? t('all_surahs') : t('all_juz')}
        </h2>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Content: Show server-rendered grid or client-rendered content */}
      {activeTab === 'surah' ? (
        <div ref={surahContainerRef}>
          {shouldShowServerGrid && children ? (
            // Use server-rendered grid when no search/filter is active
            children
          ) : (
            // Use client-rendered grid with filtering
            <SurahTab searchQuery={searchQuery} initialChapters={initialChapters} />
          )}
        </div>
      ) : (
        <Suspense fallback={<JuzTabSkeleton />}>
          <JuzTab />
        </Suspense>
      )}
    </section>
  );
}
