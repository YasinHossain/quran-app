'use client';

import { useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';

import type { Verse as VerseType } from '@/types';

/**
 * Last-read tracking for the verse reader.
 *
 * - One shared IntersectionObserver watches a thin "reading line" just below the header, so the
 *   saved verse is the one being read (this also works for verses taller than the screen).
 * - Nothing is saved until the reader scrolls (or plays audio). Opening a surah, jumping to a
 *   verse, or refreshing must not overwrite the saved position.
 */

// Matches the offset the reader uses when it jumps a verse to the top of the screen.
const READING_LINE_TOP_PX = 64;
const READING_LINE_ROOT_MARGIN = `-${READING_LINE_TOP_PX}px 0px -80% 0px`;
const USER_SCROLL_EVENTS = ['wheel', 'touchmove', 'keydown', 'mousedown'] as const;

type ReportLastRead = () => void;

const reporters = new Map<Element, ReportLastRead>();
// Verses currently inside the reading zone; it can hold two at once (end of one, start of next).
const versesOnReadingLine = new Set<Element>();
let observer: IntersectionObserver | null = null;
let isTrackingArmed = false;

const topmostVerseOnReadingLine = (): Element | null => {
  let topmost: Element | null = null;
  for (const element of versesOnReadingLine) {
    if (!topmost || topmost.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_PRECEDING) {
      topmost = element;
    }
  }
  return topmost;
};

const handleEntries = (entries: IntersectionObserverEntry[]): void => {
  for (const entry of entries) {
    if (entry.isIntersecting) versesOnReadingLine.add(entry.target);
    else versesOnReadingLine.delete(entry.target);
  }
  if (!isTrackingArmed) return;
  const topmost = topmostVerseOnReadingLine();
  if (topmost) reporters.get(topmost)?.();
};

const getObserver = (): IntersectionObserver | null => {
  if (typeof IntersectionObserver === 'undefined') return null;
  observer ??= new IntersectionObserver(handleEntries, { rootMargin: READING_LINE_ROOT_MARGIN });
  return observer;
};

const removeUserScrollListeners = (): void => {
  for (const type of USER_SCROLL_EVENTS) window.removeEventListener(type, armLastReadTracking);
};

/** Starts saving the verse on the reading line. Called on user scroll input and audio playback. */
export function armLastReadTracking(): void {
  if (typeof window === 'undefined') return;
  isTrackingArmed = true;
  removeUserScrollListeners();
}

/**
 * Pauses saving until the reader scrolls. Call when a reader mounts (opening a surah or jumping
 * to a verse remounts it). Returns a cleanup that removes the input listeners.
 */
export function resetLastReadTracking(): () => void {
  if (typeof window === 'undefined') return () => {};
  isTrackingArmed = false;
  for (const type of USER_SCROLL_EVENTS) {
    window.addEventListener(type, armLastReadTracking, { passive: true });
  }
  return removeUserScrollListeners;
}

export const useLastReadObserver = (
  verse: VerseType,
  verseRef: React.RefObject<HTMLDivElement | null>
): void => {
  const { setLastRead } = useBookmarks();

  useEffect(() => {
    const element = verseRef.current;
    const sharedObserver = getObserver();
    if (!element || !sharedObserver) return;

    const [surahId, ayah] = verse.verse_key.split(':');
    const verseNumber = Number(ayah);
    if (!surahId || !Number.isInteger(verseNumber) || verseNumber <= 0) return;

    reporters.set(element, () => setLastRead(surahId, verseNumber, verse.verse_key, verse.id));
    sharedObserver.observe(element);
    return () => {
      reporters.delete(element);
      versesOnReadingLine.delete(element);
      sharedObserver.unobserve(element);
    };
  }, [verse.verse_key, verse.id, verseRef, setLastRead]);
};
