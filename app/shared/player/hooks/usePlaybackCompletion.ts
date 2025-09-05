import { useCallback, useEffect, useState, RefObject } from 'react';

import { Verse } from '@/types';

import { useSurahRepeat } from './useSurahRepeat';

import type { RepeatOptions } from '../types';

interface Options {
  audioRef: RefObject<HTMLAudioElement | null>;
  repeatOptions: RepeatOptions;
  activeVerse: Verse | null;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  seek: (s: number) => void;
  play: () => void;
  pause: () => void;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
}

/**
 * Returns a callback for handling audio completion based on repeat settings.
 *
 * @param options playback context and controls.
 * @returns function to run when playback ends.
 */
export function usePlaybackCompletion({
  audioRef,
  repeatOptions,
  activeVerse,
  onNext,
  onPrev,
  seek,
  play,
  pause,
  setIsPlaying,
  setPlayingId,
}: Options) {
  const [verseRepeatsLeft, setVerseRepeatsLeft] = useState(repeatOptions.repeatEach ?? 1);
  const [playRepeatsLeft, setPlayRepeatsLeft] = useState(repeatOptions.playCount ?? 1);

  useEffect(() => {
    setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
    setPlayRepeatsLeft(repeatOptions.playCount ?? 1);
  }, [activeVerse, repeatOptions.repeatEach, repeatOptions.playCount]);

  const delayMs = (repeatOptions.delay ?? 0) * 1000;

  const handleSurahRepeat = useSurahRepeat({
    verseRepeatsLeft,
    playRepeatsLeft,
    repeatEach: repeatOptions.repeatEach ?? 1,
    delay: delayMs,
    onNext,
    onPrev,
    seek,
    play,
    pause,
    setIsPlaying,
    setPlayingId,
    setVerseRepeatsLeft,
    setPlayRepeatsLeft,
  });

  return useCallback(() => {
    const mode = repeatOptions.mode;
    const start = repeatOptions.start ?? 1;
    const end = repeatOptions.end ?? start;
    const delay = delayMs;
    const currentAyah = activeVerse ? parseInt(activeVerse.verse_key.split(':')[1], 10) : null;

    if (mode === 'single') {
      if (verseRepeatsLeft > 1) {
        setVerseRepeatsLeft(verseRepeatsLeft - 1);
        seek(0);
        play();
        return;
      }
      if (playRepeatsLeft > 1) {
        setPlayRepeatsLeft(playRepeatsLeft - 1);
        setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
        seek(0);
        play();
        return;
      }
    }

    if (mode === 'range') {
      if (verseRepeatsLeft > 1) {
        setVerseRepeatsLeft(verseRepeatsLeft - 1);
        seek(0);
        play();
        return;
      }
      setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
      if (currentAyah && currentAyah < end) {
        onNext?.();
        return;
      }
      if (playRepeatsLeft > 1) {
        setPlayRepeatsLeft(playRepeatsLeft - 1);
        const steps = end - start;
        setTimeout(() => {
          for (let i = 0; i < steps; i++) {
            onPrev?.();
          }
        }, delay);
        return;
      }
    }

    if (mode === 'surah') {
      handleSurahRepeat();
      return;
    }

    const hasNext = onNext?.() ?? false;
    setTimeout(() => {
      if (!hasNext || !audioRef.current?.src) {
        pause();
        setIsPlaying(false);
        setPlayingId(null);
      }
    }, 0);
  }, [
    repeatOptions,
    activeVerse,
    delayMs,
    verseRepeatsLeft,
    playRepeatsLeft,
    onNext,
    onPrev,
    seek,
    play,
    pause,
    setIsPlaying,
    setPlayingId,
    handleSurahRepeat,
    audioRef,
  ]);
}
