'use client';

import React from 'react';

import { Chapter, LastReadMap } from '@/types';

import { LastReadCard } from './LastReadCard';

interface LastReadGridProps {
  lastRead: LastReadMap;
  chapters: Chapter[];
}

export const LastReadGrid = ({ lastRead, chapters }: LastReadGridProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  if (Object.keys(lastRead).length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Recent Activity</h3>
        <p className="text-muted max-w-md mx-auto">
          Start reading the Quran and your progress will be automatically tracked here.
        </p>
      </div>
    );
  }

  const sortedEntries = Object.entries(lastRead).sort(([, a], [, b]) => b.updatedAt - a.updatedAt);

  const normalizedEntries: Array<{
    surahId: string;
    verseNumber: number;
    chapter: Chapter;
  }> = [];

  for (const [surahId, entry] of sortedEntries) {
    const chapter = chapters.find((c) => c.id === Number(surahId));
    if (!chapter) {
      continue;
    }

    const totalVerses = chapter.verses_count || 0;
    const verseNumberFromKeyRaw =
      typeof entry.verseKey === 'string' ? Number(entry.verseKey.split(':')[1]) : undefined;
    const verseNumberFromKey =
      typeof verseNumberFromKeyRaw === 'number' && !Number.isNaN(verseNumberFromKeyRaw)
        ? verseNumberFromKeyRaw
        : undefined;
    const rawVerseNumber = entry.verseNumber ?? verseNumberFromKey ?? entry.verseId;

    if (typeof rawVerseNumber !== 'number' || Number.isNaN(rawVerseNumber) || rawVerseNumber <= 0) {
      continue;
    }

    const verseNumber = totalVerses > 0 ? Math.min(rawVerseNumber, totalVerses) : rawVerseNumber;

    normalizedEntries.push({
      surahId,
      verseNumber,
      chapter,
    });

    if (normalizedEntries.length === 5) {
      break;
    }
  }

  if (normalizedEntries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Recent Activity</h3>
        <p className="text-muted max-w-md mx-auto">
          Start reading the Quran and your progress will be automatically tracked here.
        </p>
      </div>
    );
  }

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
