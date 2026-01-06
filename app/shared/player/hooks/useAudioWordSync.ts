'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useQdcAudioFile } from '@/app/shared/player/hooks/useQdcAudioFile';

import type { QdcAudioSegment, QdcAudioVerseTiming } from '@/lib/audio/qdcAudio';

function parseChapterIdFromVerseKey(verseKey: string): number | null {
  const [surahRaw] = verseKey.split(':');
  const parsed = Number.parseInt(surahRaw ?? '', 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/"/g, '\\"');
}

function findActiveWord(segments: QdcAudioSegment[], currentMs: number): number | null {
  for (const [word, startMs, endMs] of segments) {
    if (currentMs >= startMs && currentMs < endMs) {
      return word;
    }
  }
  return null;
}

function resolveVerseTiming(
  timings: QdcAudioVerseTiming[] | undefined,
  verseKey: string
): QdcAudioVerseTiming | null {
  if (!timings?.length) return null;
  return timings.find((t) => t.verseKey === verseKey) ?? null;
}

export type SelectorBuilder = (verseKey: string, activeWord: number, cssEscape: (val: string) => string) => string;

interface UseAudioWordSyncOptions {
  highlightClass: string;
  selectorBuilder: SelectorBuilder;
}

export function useAudioWordSync({ highlightClass, selectorBuilder }: UseAudioWordSyncOptions): void {
  const audio = useAudio();

  const chapterId = useMemo(() => {
    const key = audio.activeVerse?.verse_key;
    if (!key) return null;
    return parseChapterIdFromVerseKey(key);
  }, [audio.activeVerse?.verse_key]);

  const verseKey = audio.activeVerse?.verse_key ?? null;

  const { audioFile } = useQdcAudioFile(audio.reciter.id, chapterId, true);

  const verseTiming = useMemo(
    () => (verseKey ? resolveVerseTiming(audioFile?.verseTimings, verseKey) : null),
    [audioFile?.verseTimings, verseKey]
  );

  const previousElRef = useRef<HTMLElement | null>(null);
  const previousWordRef = useRef<number | null>(null);

  useEffect(() => {
    previousElRef.current?.classList.remove(highlightClass);
    previousElRef.current = null;
    previousWordRef.current = null;
  }, [verseKey, audio.isPlaying, audio.reciter.id, highlightClass]);

  useEffect(() => {
    if (!audio.isPlaying) return;
    if (!verseKey) return;

    const segments = verseTiming?.segments;
    if (!segments?.length) return;

    let attachedAudio: HTMLAudioElement | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const handleTimeUpdate = (): void => {
      if (!attachedAudio) return;
      const currentMs = (attachedAudio.currentTime || 0) * 1000;
      const activeWord = findActiveWord(segments, currentMs);

      if (activeWord === previousWordRef.current) return;
      previousWordRef.current = activeWord;

      if (previousElRef.current) {
        previousElRef.current.classList.remove(highlightClass);
        previousElRef.current = null;
      }

      if (!activeWord) return;

      const selector = selectorBuilder(verseKey, activeWord, cssEscape);
      const next = document.querySelector<HTMLElement>(selector);
      if (!next) return;
      next.classList.add(highlightClass);
      previousElRef.current = next;
    };

    const attach = (): void => {
      if (cancelled) return;
      const el = audio.audioRef.current;
      if (!el) {
        rafId = requestAnimationFrame(attach);
        return;
      }
      attachedAudio = el;
      el.addEventListener('timeupdate', handleTimeUpdate);
      handleTimeUpdate();
    };

    attach();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (attachedAudio) attachedAudio.removeEventListener('timeupdate', handleTimeUpdate);
      previousElRef.current?.classList.remove(highlightClass);
      previousElRef.current = null;
      previousWordRef.current = null;
    };
  }, [audio.isPlaying, audio.audioRef, verseKey, verseTiming, highlightClass, selectorBuilder]);

  // Handle clicking on words to seek
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent): void => {
      if (!audio.isPlayerVisible) return;

      const target = e.target as HTMLElement;
      const wordElement = target.closest('[data-verse-word="true"]');
      if (!wordElement) return;

      const elementVerseKey = wordElement.getAttribute('data-verse-key');
      const elementWordPosition = wordElement.getAttribute('data-word-position');

      if (!elementVerseKey || !elementWordPosition || !audioFile?.verseTimings) return;

      // Find timing for the clicked verse
      const timing = resolveVerseTiming(audioFile.verseTimings, elementVerseKey);
      if (!timing) return;

      const wordPosition = parseInt(elementWordPosition, 10);
      const segments = timing?.segments;
      if (!segments) return;
      
      const segment = segments.find((s) => s[0] === wordPosition);

      if (segment) {
        // segment[1] is start timestamp in ms
        const seekTimeSeconds = segment[1] / 1000;
        
        const audioEl = audio.audioRef.current;
        if (audioEl) {
          audioEl.currentTime = seekTimeSeconds;
          
          if (audioEl.paused) {
             audioEl.play().then(() => {
               audio.setIsPlaying(true);
             }).catch(() => {
               // ignore play errors (e.g. if no source loaded yet)
             });
          }
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [audio, audioFile]);
}
