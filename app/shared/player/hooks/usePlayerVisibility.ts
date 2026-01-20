import { useCallback, useRef, useState } from 'react';

import type { Verse } from '@/types';

interface Options {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayingId: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveVerse: React.Dispatch<React.SetStateAction<Verse | null>>;
}

interface UsePlayerVisibilityReturn {
  isPlayerVisible: boolean;
  playbackSessionId: number;
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
  const [isPlayerVisible, setPlayerVisible] = useState(false);
  const [playbackSessionId, setPlaybackSessionId] = useState(0);
  const sessionIdRef = useRef(0);

  const openPlayer = useCallback(() => {
    // Increment session ID to force effects to re-run
    sessionIdRef.current += 1;
    setPlaybackSessionId(sessionIdRef.current);
    setPlayerVisible(true);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setPlayingId(null);
    setActiveVerse(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayerVisible(false);
  }, [audioRef, setIsPlaying, setPlayingId, setActiveVerse]);

  return { isPlayerVisible, playbackSessionId, openPlayer, closePlayer };
}
