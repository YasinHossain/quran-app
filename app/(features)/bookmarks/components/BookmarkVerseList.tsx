'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Spinner } from '@/app/shared/Spinner';

import type { Bookmark, Verse } from '@/types';

interface BookmarkVerseListProps {
  bookmarks: Bookmark[];
}

export const BookmarkVerseList = ({ bookmarks }: BookmarkVerseListProps): React.JSX.Element => {
  if (bookmarks.length === 0) {
    return <div className="text-center py-20 text-muted">No verses in this folder</div>;
  }

  return (
    <div className="w-full relative">
      <div className="space-y-0">
        {bookmarks.map((bookmark) => (
          <BookmarkVerseListItem key={bookmark.verseId} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
};

const BookmarkVerseListItem = ({ bookmark }: { bookmark: Bookmark }): React.JSX.Element => {
  const { bookmark: enrichedBookmark, verse, isLoading, error } = useBookmarkVerse(bookmark);

  if (error) {
    return (
      <div className="text-center py-6 text-status-error bg-status-error/10 p-4 rounded-lg">
        Failed to load verse {bookmark.verseId}. {error}
      </div>
    );
  }

  if (isLoading || !verse || !enrichedBookmark.verseKey) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-accent" />
      </div>
    );
  }

  return <LoadedBookmarkVerseItem verse={verse} bookmark={enrichedBookmark} />;
};

const LoadedBookmarkVerseItem = ({
  verse,
  bookmark,
}: {
  verse: Verse;
  bookmark: Bookmark;
}): React.JSX.Element => {
  const { removeBookmark, findBookmark } = useBookmarks();
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);

  const handleRemoveBookmark = React.useCallback(() => {
    const bookmarkInfo = findBookmark(bookmark.verseId);
    if (!bookmarkInfo) return;
    removeBookmark(bookmark.verseId, bookmarkInfo.folder.id);
  }, [bookmark.verseId, findBookmark, removeBookmark]);

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
          verseKey: bookmark.verseKey ?? verse.verse_key,
          verseId: bookmark.verseId,
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
