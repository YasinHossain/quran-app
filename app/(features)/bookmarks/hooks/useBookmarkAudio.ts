import { useCallback } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';
import { Bookmark } from '@/types';

interface UseBookmarkAudioReturn {
  handlePlayPause: () => void;
  isPlaying: boolean;
  isLoadingAudio: boolean;
}

export const useBookmarkAudio = (
  enrichedBookmark: Bookmark,
  verseApiId?: number
): UseBookmarkAudioReturn => {
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

  const handlePlayPause = useCallback((): void => {
    if (!verseApiId) return;

    if (playingId === verseApiId) {
      audioRef.current?.pause();
      setPlayingId(null);
      setLoadingId(null);
      setActiveVerse(null);
      setIsPlaying(false);
    } else if (enrichedBookmark.verseKey && enrichedBookmark.verseText) {
      const verseForAudio = {
        id: verseApiId,
        verse_key: enrichedBookmark.verseKey,
        text_uthmani: enrichedBookmark.verseText,
        translations: enrichedBookmark.translation
          ? [
              {
                id: 0,
                resource_id: 0,
                text: enrichedBookmark.translation,
              },
            ]
          : [],
      };
      setActiveVerse(verseForAudio);
      setPlayingId(verseApiId);
      setLoadingId(verseApiId);
      setIsPlaying(true);
      openPlayer();
    }
  }, [
    verseApiId,
    playingId,
    enrichedBookmark.verseKey,
    enrichedBookmark.verseText,
    enrichedBookmark.translation,
    audioRef,
    setActiveVerse,
    setPlayingId,
    setLoadingId,
    setIsPlaying,
    openPlayer,
  ]);

  return {
    handlePlayPause,
    isPlaying: playingId === verseApiId,
    isLoadingAudio: loadingId === verseApiId,
  };
};
