import { useCallback } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';
import { Bookmark } from '@/types';

interface UseBookmarkAudioReturn {
  handlePlayPause: () => void;
  isPlaying: boolean;
  isLoadingAudio: boolean;
}

type VerseForAudio = {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations: Array<{ id: number; resource_id: number; text: string }>;
};

function buildVerseForAudio(bookmark: Bookmark, verseApiId?: number): VerseForAudio | null {
  if (!verseApiId || !bookmark.verseKey || !bookmark.verseText) return null;
  return {
    id: verseApiId,
    verse_key: bookmark.verseKey,
    text_uthmani: bookmark.verseText,
    translations: bookmark.translation
      ? [
          {
            id: 0,
            resource_id: 0,
            text: bookmark.translation,
          },
        ]
      : [],
  };
}

function pausePlayback(ctx: {
  audioRef: React.RefObject<HTMLAudioElement>;
  setPlayingId: (id: number | null) => void;
  setLoadingId: (id: number | null) => void;
  setActiveVerse: (v: VerseForAudio | null) => void;
  setIsPlaying: (v: boolean) => void;
}): void {
  ctx.audioRef.current?.pause();
  ctx.setPlayingId(null);
  ctx.setLoadingId(null);
  ctx.setActiveVerse(null);
  ctx.setIsPlaying(false);
}

function startPlayback(
  ctx: {
    setPlayingId: (id: number | null) => void;
    setLoadingId: (id: number | null) => void;
    setActiveVerse: (v: VerseForAudio | null) => void;
    setIsPlaying: (v: boolean) => void;
    openPlayer: () => void;
  },
  verse: VerseForAudio
): void {
  ctx.setActiveVerse(verse);
  ctx.setPlayingId(verse.id);
  ctx.setLoadingId(verse.id);
  ctx.setIsPlaying(true);
  ctx.openPlayer();
}

function createHandlePlayPause(
  ctx: ReturnType<typeof useAudio>,
  bookmark: Bookmark,
  verseApiId?: number
) {
  return (): void => {
    if (!verseApiId) return;
    if (ctx.playingId === verseApiId) {
      pausePlayback(
        ctx as unknown as {
          audioRef: React.RefObject<HTMLAudioElement>;
          setPlayingId: (id: number | null) => void;
          setLoadingId: (id: number | null) => void;
          setActiveVerse: (v: VerseForAudio | null) => void;
          setIsPlaying: (v: boolean) => void;
        }
      );
      return;
    }
    const verse = buildVerseForAudio(bookmark, verseApiId);
    if (verse) startPlayback(ctx, verse);
  };
}

export const useBookmarkAudio = (
  enrichedBookmark: Bookmark,
  verseApiId?: number
): UseBookmarkAudioReturn => {
  const audio = useAudio();

  const handlePlayPause = useCallback(
    () => createHandlePlayPause(audio, enrichedBookmark, verseApiId)(),
    [audio, enrichedBookmark, verseApiId]
  );

  return {
    handlePlayPause,
    isPlaying: audio.playingId === verseApiId,
    isLoadingAudio: audio.loadingId === verseApiId,
  };
};
