'use client';

import { motion } from 'framer-motion';
import React, { useCallback } from 'react';

import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Spinner } from '@/app/shared/Spinner';

import type { Verse as VerseType } from '@/types';

interface BookmarkVerseListProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  searchTerm?: string;
}

export const BookmarkVerseList = ({
  verses,
  isLoading,
  error,
  searchTerm = '',
}: BookmarkVerseListProps): React.JSX.Element => {
  return (
    <div className="w-full relative">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-accent" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-status-error bg-status-error/10 p-4 rounded-lg">
          {error}
        </div>
      ) : verses.length > 0 ? (
        <div className="space-y-0">
          {verses.map((verse) => (
            <VerseItem key={verse.id} verse={verse} />
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-20 text-muted">
          No verses found matching &quot;{searchTerm}&quot;
        </div>
      ) : (
        <div className="text-center py-20 text-muted">No verses in this folder</div>
      )}
    </div>
  );
};

const VerseItem = ({ verse }: { verse: VerseType }): React.JSX.Element => {
  const { removeBookmark, findBookmark } = useBookmarks();
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);

  const handleRemoveBookmark = useCallback(() => {
    const bookmarkInfo = findBookmark(String(verse.id));
    if (!bookmarkInfo) return;
    removeBookmark(String(verse.id), bookmarkInfo.folder.id);
  }, [findBookmark, removeBookmark, verse.id]);

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
          onBookmark: handleRemoveBookmark,
          showRemove: true,
        }}
      />
    </motion.div>
  );
};
