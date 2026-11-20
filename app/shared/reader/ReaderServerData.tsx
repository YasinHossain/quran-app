'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import type { Chapter, PrerenderedVerse } from '@/types';

/**
 * Data a reader route already fetched on the server, made available to the client reader tree.
 *
 * - `chapter`: metadata for the surah header (verse count, revelation place) so it is correct
 *   in server HTML instead of waiting for the client chapter list.
 * - `verses`: text-only copy of every verse in the surah/juz. The interactive list is
 *   virtualized and only mounts a window of verses; `PrerenderedVerseList` puts the remaining
 *   verses into the server HTML (for crawlers and pre-hydration readers) and unmounts once the
 *   client has hydrated.
 */
export type ReaderChapterSummary = Pick<
  Chapter,
  'id' | 'name_simple' | 'verses_count' | 'revelation_place'
>;

interface ReaderServerDataValue {
  chapter?: ReaderChapterSummary | undefined;
  verses?: PrerenderedVerse[] | undefined;
}

const ReaderServerDataContext = createContext<ReaderServerDataValue>({});

export function ReaderServerDataProvider({
  chapter,
  verses,
  children,
}: ReaderServerDataValue & { children: React.ReactNode }): React.JSX.Element {
  const value = useMemo(() => ({ chapter, verses }), [chapter, verses]);
  return (
    <ReaderServerDataContext.Provider value={value}>{children}</ReaderServerDataContext.Provider>
  );
}

export function useReaderServerChapter(
  chapterId?: number | null
): ReaderChapterSummary | undefined {
  const { chapter } = useContext(ReaderServerDataContext);
  return chapter && chapter.id === chapterId ? chapter : undefined;
}

const subscribeNoop = (): (() => void) => () => {};

/**
 * True while rendering on the server and during hydration; false afterwards and on any
 * client-side mount (e.g. soft navigation), so the static list never renders client-only.
 */
function useIsServerOrHydrating(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => false,
    () => true
  );
}

interface PrerenderedVerseListProps {
  /** Number of leading verses the interactive list already renders on the server. */
  skip: number;
}

export function PrerenderedVerseList({
  skip,
}: PrerenderedVerseListProps): React.JSX.Element | null {
  const { verses } = useContext(ReaderServerDataContext);
  // Captured once: true for the server render and hydration, false for client-only mounts.
  const isServerOrHydrating = useIsServerOrHydrating();
  const [isVisible, setIsVisible] = useState(isServerOrHydrating);
  const { settings } = useSettings();

  // Unmount after the virtualized list has had a couple of frames to measure itself, so content
  // after the list (footers, navigation) does not flash into view during the swap.
  useEffect(() => {
    if (!isVisible) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsVisible(false));
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [isVisible]);

  if (!isVisible || !verses?.length) return null;

  const remaining = verses.slice(Math.max(0, skip));
  if (!remaining.length) return null;

  return (
    <div data-slot="prerendered-verses" className="w-full">
      {remaining.map((verse) => (
        <article
          key={verse.verseKey}
          data-verse-key={verse.verseKey}
          className="border-b border-border pb-4 pt-4 md:pb-8 md:pt-6"
        >
          <div className="space-y-6">
            <p className="text-xs font-semibold text-muted-foreground">{verse.verseKey}</p>
            <p
              lang="ar"
              dir="rtl"
              className="text-right leading-loose text-foreground"
              style={{
                fontFamily: settings.arabicFontFace,
                fontSize: `${settings.arabicFontSize}px`,
              }}
            >
              {verse.arabic}
            </p>
            {verse.translations.map((translation) => (
              <p
                key={translation.resourceId}
                dir="auto"
                className="text-left leading-relaxed text-foreground"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: translation.html }}
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
