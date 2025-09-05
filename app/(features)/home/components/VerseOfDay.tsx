'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import { VerseContent } from './VerseContent';
import { VerseErrorState } from './VerseErrorState';
import { VerseLoadingState } from './VerseLoadingState';
import { useVerseOfDay } from '../hooks/useVerseOfDay';

interface VerseOfDayProps {
  className?: string;
  /** Interval in ms between automatic rotations */
  rotationInterval?: number;
  /** Number of rotations before fetching a new random verse */
  randomVerseInterval?: number;
}

// Custom hook for verse transitions
interface UseVerseTransitionProps {
  verse: any;
  initialLoad: boolean;
  setInitialLoad: (value: boolean) => void;
  setIsTransitioning: (value: boolean) => void;
  setDisplayVerse: (verse: any) => void;
}

const useVerseTransition = ({
  verse,
  initialLoad,
  setInitialLoad,
  setIsTransitioning,
  setDisplayVerse,
}: UseVerseTransitionProps) => {
  useEffect(() => {
    if (!verse) return;

    if (initialLoad) {
      // First verse load
      setDisplayVerse(verse);
      setInitialLoad(false);
      return;
    }

    // Start transition animation for verse changes
    setIsTransitioning(true);

    // After fade out completes, update verse and fade in
    const timer = setTimeout(() => {
      setDisplayVerse(verse);
      setIsTransitioning(false);
    }, 300); // Smooth transition duration

    return () => clearTimeout(timer);
  }, [verse, initialLoad, setInitialLoad, setIsTransitioning, setDisplayVerse]);
};

// Surah name lookup hook
const useSurahName = (displayVerse: any, surahs: any[]) => {
  return useMemo(() => {
    if (!displayVerse) return null;
    const [surahNum] = displayVerse.verse_key.split(':');
    return surahs.find((s) => s.number === Number(surahNum))?.name;
  }, [displayVerse, surahs]);
};

// Render states component
interface RenderStatesProps {
  loading: boolean;
  initialLoad: boolean;
  error: any;
  displayVerse: any;
  className?: string;
  onRetry: () => void;
  surahName: string | null;
  tajweedEnabled: boolean;
  isTransitioning: boolean;
}

const RenderStates = ({
  loading,
  initialLoad,
  error,
  displayVerse,
  className,
  onRetry,
  surahName,
  tajweedEnabled,
  isTransitioning,
}: RenderStatesProps): React.JSX.Element | null => {
  if (loading && initialLoad) {
    return <VerseLoadingState className={className} />;
  }

  if (error) {
    return <VerseErrorState error={error} onRetry={onRetry} className={className} />;
  }

  if (!displayVerse) {
    return null;
  }

  return (
    <VerseContent
      verse={displayVerse}
      surahName={surahName}
      tajweedEnabled={tajweedEnabled}
      isTransitioning={isTransitioning}
      className={className}
    />
  );
};

/**
 * Verse of the Day component with smooth transitions and mobile-first design.
 * Displays a random verse with Arabic text, translation, and smooth animations.
 *
 * Features:
 * - Random verse selection with refresh functionality
 * - Smooth transition animations between verses
 * - Tajweed highlighting support
 * - Word-by-word tooltip display
 * - Mobile-first responsive design
 * - Performance optimized with memo() wrapper
 */
export const VerseOfDay = memo(function VerseOfDay({
  className,
  rotationInterval,
  randomVerseInterval,
}: VerseOfDayProps): React.JSX.Element | null {
  const { settings } = useSettings();
  const { verse, loading, error, surahs, refreshVerse } = useVerseOfDay({
    ...(rotationInterval !== undefined ? { rotationInterval } : {}),
    ...(randomVerseInterval !== undefined ? { randomVerseInterval } : {}),
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayVerse, setDisplayVerse] = useState(verse);
  const [initialLoad, setInitialLoad] = useState(true);

  const surahName = useSurahName(displayVerse, surahs);

  const handleRefresh = useCallback(() => {
    refreshVerse();
  }, [refreshVerse]);

  useVerseTransition({
    verse,
    initialLoad,
    setInitialLoad,
    setIsTransitioning,
    setDisplayVerse,
  });

  return (
    <RenderStates
      loading={loading}
      initialLoad={initialLoad}
      error={error}
      displayVerse={displayVerse}
      className={className}
      onRetry={handleRefresh}
      surahName={surahName}
      tajweedEnabled={settings.tajweed}
      isTransitioning={isTransitioning}
    />
  );
});
