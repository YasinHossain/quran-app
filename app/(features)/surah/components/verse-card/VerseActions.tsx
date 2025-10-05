'use client';

import React from 'react';

import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';

interface VerseActionsProps {
  verseKey: string;
  verseId: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
}
export function VerseActions({
  verseKey,
  verseId,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
}: VerseActionsProps): React.JSX.Element {
  return (
    <ResponsiveVerseActions
      verseKey={verseKey}
      verseId={verseId}
      isPlaying={isPlaying}
      isLoadingAudio={isLoadingAudio}
      isBookmarked={isBookmarked}
      onPlayPause={onPlayPause}
      className="md:w-16 md:pt-1"
    />
  );
}
