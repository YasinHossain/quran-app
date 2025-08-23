'use client';

import React, { useState, useEffect } from 'react';
import { Folder, Bookmark } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { BookmarkCard } from './BookmarkCard';
import { FixedSizeList as List } from 'react-window';

interface BookmarkListViewProps {
  folder: Folder;
  onBack?: () => void;
  bookmarks?: Bookmark[];
  showAsVerseList?: boolean;
}

export const BookmarkListView = ({
  folder,
  onBack,
  bookmarks: externalBookmarks,
  showAsVerseList = false,
}: BookmarkListViewProps) => {
  const [bookmarks, setBookmarks] = useState(externalBookmarks || folder.bookmarks);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setListHeight(window.innerHeight - 200);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Update local state when external bookmarks change
  useEffect(() => {
    if (externalBookmarks) {
      setBookmarks(externalBookmarks);
    } else {
      setBookmarks(folder.bookmarks);
    }
  }, [externalBookmarks, folder.bookmarks]);

  const handleRemoveBookmark = (verseId: string) => {
    // Update local state to immediately remove the bookmark
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.verseId !== verseId));
  };

  // If showing as verse list (folder page), display verses like surah page
  if (showAsVerseList) {
    return bookmarks.length > 0 ? (
      <List height={listHeight} width="100%" itemCount={bookmarks.length} itemSize={140}>
        {({ index, style }) => {
          const bookmark = bookmarks[index];
          return (
            <div style={style} className="px-0">
              <BookmarkCard
                bookmark={bookmark}
                folderId={folder.id}
                onRemove={() => handleRemoveBookmark(bookmark.verseId)}
              />
            </div>
          );
        }}
      </List>
    ) : (
      <div className="text-center py-16">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Bookmarks</h3>
          <p className="text-muted mb-4">
            This folder is empty. Add some bookmarked verses to see them here.
          </p>
        </div>
      </div>
    );
  }

  // Default card layout (main bookmark page)
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      {onBack && (
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={onBack}
            className="rounded-full p-2 text-muted hover:bg-surface-hover hover:text-accent transition-colors"
            aria-label="Go back to folders"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-1">{folder.name}</h1>
            <p className="text-muted">
              {bookmarks.length} {bookmarks.length === 1 ? 'verse' : 'verses'} bookmarked
            </p>
          </div>
        </div>
      )}

      {/* Bookmark Cards */}
      {bookmarks.length > 0 ? (
        <List height={listHeight} width="100%" itemCount={bookmarks.length} itemSize={180}>
          {({ index, style }) => {
            const bookmark = bookmarks[index];
            return (
              <div style={style} className="px-0">
                <BookmarkCard
                  bookmark={bookmark}
                  folderId={folder.id}
                  onRemove={() => handleRemoveBookmark(bookmark.verseId)}
                />
              </div>
            );
          }}
        </List>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Bookmarks</h3>
          <p className="text-muted max-w-md mx-auto mb-4">
            This folder is empty. Start bookmarking verses while reading to add them here.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Back to Folders
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
