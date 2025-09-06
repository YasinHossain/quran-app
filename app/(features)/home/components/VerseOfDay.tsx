'use client';

import { memo, useCallback, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import { RenderStates } from './RenderStates';
import { useSurahName } from '../hooks/useSurahName';
import { useVerseOfDay } from '../hooks/useVerseOfDay';
import { useVerseTransition } from '../hooks/useVerseTransition';

import type { Verse } from '@/types';

interface VerseOfDayProps {
  className?: string;
  /** Interval in ms between automatic rotations */
  rotationInterval?: number;
  /** Number of rotations before fetching a new random verse */
  randomVerseInterval?: number;
}

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
  const [displayVerse, setDisplayVerse] = useState<Verse | null>(verse);
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
