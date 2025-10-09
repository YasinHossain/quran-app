'use client';

import React, { memo } from 'react';

import { BaseCard, BaseCardProps } from '../BaseCard';
import { FolderContextMenu } from '@/app/(features)/bookmarks/components/FolderContextMenu';
import { ClockIcon, FolderIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';
import { applyOpacity } from './folderColor.utils';

interface FolderData {
  name: string;
  icon?: string;
  color?: string;
  bookmarks: Array<{ verseId: string | number; verseKey?: string }> | { length: number };
}

interface EnhancedFolderCardProps extends Omit<BaseCardProps, 'children' | 'onClick'> {
  folder: FolderData;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const EnhancedFolderCard = memo(function EnhancedFolderCard({
  folder,
  onEdit,
  onDelete,
  onRename,
  onColorChange,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: EnhancedFolderCardProps): React.JSX.Element {
  const bookmarkCount = Array.isArray(folder.bookmarks)
    ? folder.bookmarks.length
    : folder.bookmarks.length;

  const defaultAriaLabel = `Open folder ${folder.name} with ${bookmarkCount} bookmarks`;

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  const versePreview = Array.isArray(folder.bookmarks)
    ? (folder.bookmarks as Array<{ verseId: string | number; verseKey?: string }>).slice(0, 3)
    : [];
  const latestBookmarkTimestamp = Array.isArray(folder.bookmarks)
    ? folder.bookmarks.reduce((latest: number, b: any) => Math.max(latest, b?.createdAt ?? 0), 0)
    : 0;
  const formattedUpdatedAt =
    latestBookmarkTimestamp > 0
      ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
          new Date(latestBookmarkTimestamp)
        )
      : null;

  return (
    <BaseCard
      variant="folder"
      animation="folder"
      {...(onClick
        ? { onClick: onClick as React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement> }
        : {})}
      role="button"
      tabIndex={0}
      aria-label={(ariaLabel || defaultAriaLabel) as string}
      onKeyDown={handleKeyDown}
      className="relative"
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div
            className={cn(
              'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-accent font-semibold'
            )}
            style={{
              backgroundColor: applyOpacity('rgb(var(--color-accent))', 0.1),
              boxShadow: `0 10px 24px -18px ${applyOpacity('rgb(var(--color-accent))', 0.5)}`,
            }}
            aria-hidden="true"
          >
            <FolderIcon size={20} className="text-accent" />
            {/* Count bubble */}
            <span className="absolute -top-1 -right-1 select-none rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm border border-border">
              {bookmarkCount}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate mb-1 group-hover:text-accent transition-colors duration-200">
              {folder.name}
            </h3>
            <p className="text-sm text-muted font-medium">
              {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <FolderContextMenu onDelete={onDelete} onRename={onRename} onEdit={onEdit} onColorChange={onColorChange} />
        </div>
      </div>

      {/* Verse preview chips */}
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {versePreview.map((b) => (
          <span
            key={String(b.verseId)}
            className="inline-flex shrink-0 items-center rounded-full bg-surface whitespace-nowrap leading-none px-2.5 py-1 text-[11px] font-medium text-muted transition-colors duration-200 group-hover:text-foreground/80 border border-border/40"
          >
            {b.verseKey || b.verseId}
          </span>
        ))}
        {formattedUpdatedAt ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted/80">
            <ClockIcon className="h-3.5 w-3.5" /> {formattedUpdatedAt}
          </span>
        ) : null}
      </div>
    </BaseCard>
  );
});
