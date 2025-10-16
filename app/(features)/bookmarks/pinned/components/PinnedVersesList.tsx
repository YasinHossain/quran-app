'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React, { useCallback } from 'react';

import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Spinner } from '@/app/shared/Spinner';

import type { PinnedVerseEntry } from '../hooks/usePinnedPage';

interface PinnedVersesListProps {
  entries: PinnedVerseEntry[];
  isLoading: boolean;
  error: string | null;
}

export const PinnedVersesList = ({
  entries,
  isLoading,
  error,
}: PinnedVersesListProps): React.JSX.Element => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-status-error bg-status-error/10 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Pinned Verses</h3>
        <p className="text-muted max-w-md mx-auto">
          Pin your favorite verses while reading to access them quickly from here.
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <div className="space-y-0">
        {entries.map((entry) => (
          <PinnedVerseItem key={entry.bookmark.verseId} entry={entry} />
        ))}
      </div>
    </motion.div>
  );
};

const PinnedVerseItem = ({ entry }: { entry: PinnedVerseEntry }): React.JSX.Element => {
  const { bookmark, verse } = entry;
  const router = useRouter();
  const { togglePinned, isPinned } = useBookmarks();
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);

  const handleNavigateToVerse = useCallback(() => {
    if (!verse.verse_key) return;
    const [surahId] = verse.verse_key.split(':');
    if (!surahId) return;
    router.push(`/surah/${surahId}#verse-${bookmark.verseId}`);
  }, [router, verse.verse_key, bookmark.verseId]);

  const handleTogglePinned = useCallback(() => {
    togglePinned(bookmark.verseId, { verseKey: verse.verse_key });
  }, [togglePinned, bookmark.verseId, verse.verse_key]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ReaderVerseCard
        ref={verseRef}
        verse={verse}
        actions={{
          verseKey: verse.verse_key,
          verseId: String(verse.id),
          isPlaying,
          isLoadingAudio,
          isBookmarked: isVerseBookmarked,
          onPlayPause: handlePlayPause,
          onBookmark: handleTogglePinned,
          onNavigateToVerse: handleNavigateToVerse,
          showRemove: isPinned(bookmark.verseId),
        }}
      />
    </motion.div>
  );
};
