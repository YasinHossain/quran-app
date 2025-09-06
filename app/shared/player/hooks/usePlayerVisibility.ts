import { useCallback, useState } from 'react';

import type { Verse } from '@/types';

interface Options {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayingId: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveVerse: React.Dispatch<React.SetStateAction<Verse | null>>;
}

interface UsePlayerVisibilityReturn {
  isPlayerVisible: boolean;
  openPlayer: () => void;
  closePlayer: () => void;
}

/**
 * Controls visibility of the audio player and resets playback when closed.
 */
export function usePlayerVisibility({
  audioRef,
  setIsPlaying,
  setPlayingId,
  setActiveVerse,
}: Options): UsePlayerVisibilityReturn {
  const [isPlayerVisible, setPlayerVisible] = useState(true);

  const openPlayer = useCallback(() => {
    setPlayerVisible(true);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setPlayingId(null);
    setActiveVerse(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayerVisible(false);
  }, [audioRef, setIsPlaying, setPlayingId, setActiveVerse]);

  return { isPlayerVisible, openPlayer, closePlayer };
}
