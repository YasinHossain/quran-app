'use client';

import React from 'react';

import { ClockIcon } from '@/app/shared/icons';
import { Chapter, LastReadMap } from '@/types';

import { LastReadCard } from './LastReadCard';

interface LastReadGridProps {
  lastRead: LastReadMap;
  chapters: Chapter[];
}

export const LastReadGrid = ({ lastRead, chapters }: LastReadGridProps): React.JSX.Element => {
  const isVisible = useMountVisible();

  if (Object.keys(lastRead).length === 0) return <LastReadEmptyState />;

  const normalizedEntries = buildNormalizedLastReadEntries(lastRead, chapters);
  if (normalizedEntries.length === 0) return <LastReadEmptyState />;

  return (
    <div
      className={`grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3 md:gap-4 transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {normalizedEntries.map(({ surahId, verseNumber, chapter }, index) => (
        <LastReadCard
          key={surahId}
          surahId={surahId}
          verseId={verseNumber}
          chapter={chapter}
          index={index}
        />
      ))}
    </div>
  );
};

function LastReadEmptyState(): React.JSX.Element {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <ClockIcon size={32} className="text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Recent Activity</h3>
      <p className="text-muted max-w-md mx-auto">
        Start reading the Quran and your progress will be automatically tracked here.
      </p>
    </div>
  );
}

function useMountVisible(): boolean {
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => setIsVisible(true), []);
  return isVisible;
}

function buildNormalizedLastReadEntries(
  lastRead: LastReadMap,
  chapters: Chapter[]
): Array<{ surahId: string; verseNumber: number; chapter: Chapter }> {
  const sortedEntries = Object.entries(lastRead).sort(([, a], [, b]) => b.updatedAt - a.updatedAt);
  const normalizedEntries: Array<{ surahId: string; verseNumber: number; chapter: Chapter }> = [];
  for (const [surahId, entry] of sortedEntries) {
    const normalized = normalizeLastReadEntry(surahId, entry, chapters);
    if (normalized) {
      normalizedEntries.push(normalized);
      if (normalizedEntries.length === 5) break;
    }
  }
  return normalizedEntries;
}

function normalizeLastReadEntry(
  surahId: string,
  entry: LastReadMap[string],
  chapters: Chapter[]
): { surahId: string; verseNumber: number; chapter: Chapter } | null {
  const chapter = chapters.find((c) => c.id === Number(surahId));
  if (!chapter) return null;

  const totalVerses = chapter.verses_count || 0;
  const rawVerseNumber = getRawVerseNumber(entry);
  if (!isValidVerseNumber(rawVerseNumber)) return null;
  const verseNumber = clampVerseNumber(rawVerseNumber, totalVerses);
  return { surahId, verseNumber, chapter };
}

function getRawVerseNumber(entry: LastReadMap[string]): number | undefined {
  const verseNumberFromKeyRaw =
    typeof entry.verseKey === 'string' ? Number(entry.verseKey.split(':')[1]) : undefined;
  const verseNumberFromKey =
    typeof verseNumberFromKeyRaw === 'number' && !Number.isNaN(verseNumberFromKeyRaw)
      ? verseNumberFromKeyRaw
      : undefined;
  return entry.verseNumber ?? verseNumberFromKey ?? entry.verseId;
}

function isValidVerseNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && value > 0;
}

function clampVerseNumber(num: number, total: number): number {
  return total > 0 ? Math.min(num, total) : num;
}
