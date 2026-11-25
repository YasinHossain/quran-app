'use client';

import React, { createContext, useContext, useMemo } from 'react';

import type { Chapter } from '@/types';

/**
 * Data a reader route already prepared on the server, made available to the client reader tree.
 *
 * - `chapter`: metadata for the surah header (verse count, revelation place) so it is correct
 *   in server HTML instead of waiting for the client chapter list.
 * - `fullText`: a server-rendered node (see `ReaderFullText`) holding every verse as text. The
 *   reader renders it below the virtualized list, on the server and on client navigations.
 */
export type ReaderChapterSummary = Pick<
  Chapter,
  'id' | 'name_simple' | 'verses_count' | 'revelation_place'
>;

interface ReaderServerDataValue {
  chapter?: ReaderChapterSummary | undefined;
  fullText?: React.ReactNode;
  /** Server-rendered node shown under the juz/page heading (e.g. the surahs of a juz). */
  intro?: React.ReactNode;
}

const ReaderServerDataContext = createContext<ReaderServerDataValue>({});

export function ReaderServerDataProvider({
  chapter,
  fullText,
  intro,
  children,
}: ReaderServerDataValue & { children: React.ReactNode }): React.JSX.Element {
  const value = useMemo(() => ({ chapter, fullText, intro }), [chapter, fullText, intro]);
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

export function useReaderFullText(): React.ReactNode {
  return useContext(ReaderServerDataContext).fullText ?? null;
}

export function useReaderIntro(): React.ReactNode {
  return useContext(ReaderServerDataContext).intro ?? null;
}
