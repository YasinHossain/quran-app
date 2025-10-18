'use client';

import React from 'react';

import { VerseItem } from '@/app/(features)/bookmarks/components/bookmark-verse-sidebar/VerseItem';
import { Bookmark } from '@/types';

interface ExpandedContentProps {
  isExpanded: boolean;
  folderBookmarks: Bookmark[];
}

export const ExpandedContent = ({
  isExpanded,
  folderBookmarks,
}: ExpandedContentProps): React.JSX.Element | null => {
  if (!isExpanded) return null;

  return (
    <div className="w-full border-t border-border/20 bg-surface-glass/80 text-foreground rounded-b-xl backdrop-blur-xl">
      {folderBookmarks.length > 0 ? (
        folderBookmarks.map((bookmark, index) => (
          <VerseItem
            key={String(bookmark.verseId)}
            bookmark={bookmark}
            showDivider={index < folderBookmarks.length - 1}
          />
        ))
      ) : (
        <p className="px-4 py-4 text-sm text-center text-muted">This folder is empty.</p>
      )}
    </div>
  );
};
