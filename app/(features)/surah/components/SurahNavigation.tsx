'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getChapters } from '@/lib/api/chapters';

import type { Chapter } from '@/types';

interface SurahNavigationProps {
  currentSurahId: number;
  className?: string;
}

const ChevronLeft = (): React.JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M11.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L8.414 10l3.293 3.293a1 1 0 001.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRight = (): React.JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 10l-3.293-3.293a1 1 0 00-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Navigation component for moving between surahs.
 * Displays Previous and Next buttons at the end of each surah.
 */
export function SurahNavigation({
  currentSurahId,
  className,
}: SurahNavigationProps): React.JSX.Element | null {
  const { t } = useTranslation();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async (): Promise<void> => {
      try {
        const result = await getChapters();
        setChapters(result);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchChapters();
  }, []);

  const handleNavigation = useCallback(
    (surahId: number) => {
      router.push(`/surah/${surahId}`);
    },
    [router]
  );

  if (isLoading || chapters.length === 0) {
    return null;
  }

  const currentIndex = chapters.findIndex((ch) => ch.id === currentSurahId);
  if (currentIndex === -1) {
    return null;
  }

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < chapters.length - 1;
  const previousChapter = hasPrevious ? chapters[currentIndex - 1] : null;
  const nextChapter = hasNext ? chapters[currentIndex + 1] : null;

  return (
    <div className={`flex w-full items-center justify-center py-8 ${className || ''}`}>
      <div className="inline-flex items-center gap-2 rounded-full bg-interactive p-1.5">
        {/* Previous Button */}
        <button
          onClick={() => previousChapter && handleNavigation(previousChapter.id)}
          disabled={!hasPrevious}
          className="group relative flex h-10 min-w-[130px] items-center justify-center rounded-full bg-surface px-8 text-sm font-medium text-foreground shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            previousChapter ? `${t('previous')}: ${previousChapter.name_simple}` : t('previous')
          }
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
            <ChevronLeft />
          </span>
          <span>{t('previous')}</span>
        </button>

        {/* Next Button */}
        <button
          onClick={() => nextChapter && handleNavigation(nextChapter.id)}
          disabled={!hasNext}
          className="group relative flex h-10 min-w-[130px] items-center justify-center rounded-full bg-surface px-8 text-sm font-medium text-foreground shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={nextChapter ? `${t('next')}: ${nextChapter.name_simple}` : t('next')}
        >
          <span>{t('next')}</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
            <ChevronRight />
          </span>
        </button>
      </div>
    </div>
  );
}
