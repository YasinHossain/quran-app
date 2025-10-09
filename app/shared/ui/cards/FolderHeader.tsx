'use client';

import React, { memo } from 'react';

import { FolderContextMenu } from '@/app/(features)/bookmarks/components/FolderContextMenu';
import { FolderIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

interface FolderData {
  name: string;
  icon?: string;
  color?: string;
  bookmarks: Array<{ verseId: string; verseKey?: string }> | { length: number };
}

interface FolderHeaderProps {
  folder: FolderData;
  bookmarkCount: number;
  onDelete: () => void;
  onRename: () => void;
}

const FolderIconSection = memo(function FolderIconSection({
  folder,
}: {
  folder: FolderData;
}): React.JSX.Element {
  return (
    <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors duration-300">
      {folder.icon ? (
        <span className={cn('text-2xl', folder.color || 'text-accent')} aria-hidden="true">
          {folder.icon}
        </span>
      ) : (
        <FolderIcon size={28} className={cn(folder.color || 'text-accent')} aria-hidden="true" />
      )}
    </div>
  );
});

const FolderInfoSection = memo(function FolderInfoSection({
  folder,
  bookmarkCount,
}: {
  folder: FolderData;
  bookmarkCount: number;
}): React.JSX.Element {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-lg text-foreground truncate mb-1 group-hover:text-accent transition-colors duration-200">
        {folder.name}
      </h3>
      <p className="text-sm text-muted font-medium">
        {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'}
      </p>
    </div>
  );
});

export const FolderHeader = memo(function FolderHeader({
  folder,
  bookmarkCount,
  onDelete,
  onRename,
}: FolderHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <FolderIconSection folder={folder} />
        <FolderInfoSection folder={folder} bookmarkCount={bookmarkCount} />
      </div>
      <div className="flex-shrink-0">
        <FolderContextMenu
          onDelete={onDelete}
          onRename={onRename}
        />
      </div>
    </div>
  );
});
