'use client';

import { useCallback, useRef } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import { useLastReadObserver } from './useVerseLastReadObserver';

import type { Verse as VerseType } from '@/types';

interface UseVerseCardReturn {
  verseRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isVerseBookmarked: boolean;
  handlePlayPause: () => void;
}

export const useVerseCard = (verse: VerseType): UseVerseCardReturn => {
  const {
    playingId,
    setPlayingId,
    loadingId,
    setLoadingId,
    setActiveVerse,
    audioRef,
    setIsPlaying,
    openPlayer,
  } = useAudio();
  const { isBookmarked } = useBookmarks();

  const verseRef = useRef<HTMLDivElement | null>(null);
  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isVerseBookmarked = isBookmarked(String(verse.id));

  useLastReadObserver(verse, verseRef);

  const handlePlayPause = useCallback(() => {
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

  return { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause };
};
