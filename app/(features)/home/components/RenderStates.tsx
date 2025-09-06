'use client';

import { VerseContent } from './VerseContent';
import { VerseErrorState } from './VerseErrorState';
import { VerseLoadingState } from './VerseLoadingState';

import type { Verse } from '@/types';

interface RenderStatesProps {
  loading: boolean;
  initialLoad: boolean;
  error: string | null;
  displayVerse: Verse | null;
  className?: string;
  onRetry: () => void;
  surahName: string | null;
  tajweedEnabled: boolean;
  isTransitioning: boolean;
}

export function RenderStates({
  loading,
  initialLoad,
  error,
  displayVerse,
  className,
  onRetry,
  surahName,
  tajweedEnabled,
  isTransitioning,
}: RenderStatesProps): React.JSX.Element | null {
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
}
