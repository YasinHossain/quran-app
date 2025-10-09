'use client';

import React from 'react';

import { Bookmark } from '@/types';

import { VerseItem } from './VerseItem';

interface VerseListProps {
  bookmarks: Bookmark[];
  onVerseSelect?: ((verseId: string) => void) | undefined;
}

export const VerseList = ({ bookmarks, onVerseSelect }: VerseListProps): React.JSX.Element => (
  <div className="flex-1 overflow-y-auto">
    {bookmarks.length === 0 ? (
      <div className="p-4 text-center text-muted">
        <p>No verses in this folder</p>
      </div>
    ) : (
      <div>
        {bookmarks.map((bookmark) => (
          <VerseItem
            key={String(bookmark.verseId)}
            bookmark={bookmark}
            {...(onVerseSelect && {
              onSelect: () => onVerseSelect(String(bookmark.verseId)),
            })}
          />
        ))}
      </div>
    )}
  </div>
);
