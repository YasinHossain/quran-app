'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { BookmarkCard } from '@/app/(features)/bookmarks/components/BookmarkCard';
import { Bookmark } from '@/types';

interface PinnedVersesListProps {
  pinnedVerses: Bookmark[] | undefined;
}

export const PinnedVersesList = ({ pinnedVerses }: PinnedVersesListProps): React.JSX.Element => {
  if (!pinnedVerses || pinnedVerses.length === 0) {
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div>
        {pinnedVerses?.map((bookmark) => (
          <BookmarkCard key={String(bookmark.verseId)} bookmark={bookmark} folderId="pinned" />
        ))}
      </div>
    </motion.div>
  );
};
