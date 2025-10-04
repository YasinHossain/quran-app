'use client';

import { useCallback, type JSX } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';
import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';
import { Verse as VerseType } from '@/types';

interface VerseActionsProps {
  verse: VerseType;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isVerseBookmarked: boolean;
  onBookmark: () => void;
}

const useVersePlayPause = (verse: VerseType): (() => void) => {
  const {
    playingId,
    setPlayingId,
    setLoadingId,
    setActiveVerse,
    audioRef,
    setIsPlaying,
    openPlayer,
  } = useAudio();

  return useCallback((): void => {
    if (playingId === verse.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setLoadingId(null);
      setActiveVerse(null);
      setIsPlaying(false);
    } else {
      setActiveVerse(verse);
      setPlayingId(verse.id);
      setLoadingId(verse.id);
      setIsPlaying(true);
      openPlayer();
    }
  }, [
    playingId,
    verse,
    audioRef,
    setActiveVerse,
    setPlayingId,
    setLoadingId,
    setIsPlaying,
    openPlayer,
  ]);
};

export function VerseActions({
  verse,
  isPlaying,
  isLoadingAudio,
  isVerseBookmarked,
  onBookmark,
}: VerseActionsProps): JSX.Element {
  const handlePlayPause = useVersePlayPause(verse);

  return (
    <ResponsiveVerseActions
      verseKey={verse.verse_key}
      isPlaying={isPlaying}
      isLoadingAudio={isLoadingAudio}
      isBookmarked={isVerseBookmarked}
      onPlayPause={handlePlayPause}
      onBookmark={onBookmark}
      className="md:w-16 md:pt-1"
    />
  );
}
