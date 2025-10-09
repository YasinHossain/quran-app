'use client';

import React from 'react';

import { VerseItem } from '@/app/(features)/bookmarks/components/bookmark-verse-sidebar/VerseItem';
import { Bookmark } from '@/types';

interface ExpandedContentProps {
  isExpanded: boolean;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
}

export const ExpandedContent = ({
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
}: ExpandedContentProps): React.JSX.Element | null => {
  if (!isExpanded || !isCurrentFolder) return null;

  return (
    <div className="px-4 pb-3">
      <div className="border-t border-border pt-2">
        {folderBookmarks.length > 0 ? (
          folderBookmarks.map((bookmark) => (
            <VerseItem key={String(bookmark.verseId)} bookmark={bookmark} />
          ))
        ) : (
          <p className="py-4 text-sm text-center text-muted">This folder is empty.</p>
        )}
      </div>
    </div>
  );
};
