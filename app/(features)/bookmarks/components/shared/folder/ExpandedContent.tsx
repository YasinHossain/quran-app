'use client';

import React from 'react';

import { Bookmark } from '@/types';

import { VerseItem } from '../../bookmark-verse-sidebar/VerseItem';

interface ExpandedContentProps {
  isExpanded: boolean;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
}

export const ExpandedContent = ({
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
  activeVerseId,
  onVerseSelect,
}: ExpandedContentProps): React.JSX.Element | null => {
  if (!isExpanded || !isCurrentFolder) return null;

  return (
    <div className="px-4 pb-3">
      <div className="border-t border-border pt-2">
        {folderBookmarks.length > 0 ? (
          folderBookmarks.map((bookmark) => (
            <VerseItem
              key={bookmark.verseId}
              bookmark={bookmark}
              isActive={activeVerseId === bookmark.verseId}
              onSelect={() => onVerseSelect?.(bookmark.verseId)}
            />
          ))
        ) : (
          <p className="py-4 text-sm text-center text-muted">This folder is empty.</p>
        )}
      </div>
    </div>
  );
};
