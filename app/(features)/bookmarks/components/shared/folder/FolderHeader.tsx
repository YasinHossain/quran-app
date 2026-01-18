'use client';

import Link from 'next/link';
import React from 'react';

import { colors } from '@/app/shared/design-system/card-tokens';
import { FolderGlyph } from '@/app/shared/ui/cards/FolderGlyph';
import { cn } from '@/lib/utils/cn';
import { Bookmark, Folder } from '@/types';

interface FolderHeaderProps {
  folderItem: Folder;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
  onToggle: (folderId: string) => void;
  href: string;
  className?: string;
  showDivider?: boolean;
}

interface FolderIconProps {
  folderItem: Folder;
}

interface FolderInfoProps {
  folderItem: Folder;
  folderBookmarks: Bookmark[];
  isCurrentFolder: boolean;
}

const FolderIconDisplay = ({ folderItem }: FolderIconProps): React.JSX.Element => (
  <FolderGlyph
    folder={folderItem}
    size="lg"
    backgroundOpacity={0.95}
    shadowOpacity={0.25}
    shadowOverride="0 12px 28px -18px"
  />
);

const FolderInfo = ({
  folderItem,
  folderBookmarks,
  isCurrentFolder,
}: FolderInfoProps): React.JSX.Element => {
  const verseCount = `${folderBookmarks.length} ${folderBookmarks.length === 1 ? 'verse' : 'verses'
    }`;

  return (
    <div className="min-w-0 flex flex-col gap-1">
      <p
        className={cn(
          'line-clamp-2 text-[1.08rem] leading-[1.1] font-semibold transition-colors duration-200',
          isCurrentFolder ? colors.text.accent : `${colors.text.primary} ${colors.text.hoverAccent}`
        )}
      >
        {folderItem.name}
      </p>
      <p
        className={cn(
          'text-sm leading-[1.1] font-medium transition-colors duration-200',
          colors.text.secondary
        )}
      >
        {verseCount}
      </p>
    </div>
  );
};

export const FolderHeader = ({
  folderItem,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  href,
  className,
  showDivider = false,
}: FolderHeaderProps): React.JSX.Element => {
  // If already on the current folder, clicking toggles expand/collapse
  // Otherwise, navigation is handled by the Link
  const handleClick = (e: React.MouseEvent): void => {
    if (isCurrentFolder) {
      e.preventDefault();
      onToggle(folderItem.id);
    }
    // Let Link handle navigation for non-current folders
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (isCurrentFolder) {
        e.preventDefault();
        onToggle(folderItem.id);
      }
      // Let Link handle navigation for non-current folders
    }
  };

  const content = (
    <>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <FolderIconDisplay folderItem={folderItem} />
        <FolderInfo
          folderItem={folderItem}
          folderBookmarks={folderBookmarks}
          isCurrentFolder={isCurrentFolder}
        />
      </div>
      {showDivider ? (
        <div className="absolute bottom-0 left-4 right-4 h-px bg-border transition-opacity duration-200" />
      ) : null}
    </>
  );

  const sharedClassName = cn(
    'relative flex w-full min-h-[80px] items-center gap-4 cursor-pointer px-4 py-4 transition-colors duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border/40 focus-visible:ring-offset-0',
    className
  );

  return (
    <Link
      href={href}
      prefetch={true}
      scroll={false}
      className={sharedClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={
        isCurrentFolder ? `Toggle folder ${folderItem.name}` : `Open folder ${folderItem.name}`
      }
    >
      {content}
    </Link>
  );
};
