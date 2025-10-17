'use client';

import React, { memo } from 'react';

import { FolderContextMenu } from '@/app/(features)/bookmarks/components/FolderContextMenu';
import { ClockIcon } from '@/app/shared/icons';
import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';
import { cn } from '@/lib/utils/cn';

import { FolderGlyph } from './FolderGlyph';

interface FolderData {
  name: string;
  icon?: string;
  color?: string;
  bookmarks: Array<{ verseId: string | number; verseKey?: string }> | { length: number };
}

interface EnhancedFolderCardProps extends Omit<BaseCardProps, 'children' | 'onClick'> {
  folder: FolderData;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const EnhancedFolderCard = memo(function EnhancedFolderCard({
  folder,
  onDelete,
  onRename,
  onColorChange,
  onClick,
  'aria-label': ariaLabel,
  className,
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
  const remainingCount = Array.isArray(folder.bookmarks)
    ? Math.max(0, bookmarkCount - versePreview.length)
    : 0;
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
      direction="column"
      align="start"
      gap="gap-3"
      customVariant={{ height: 'min-h-[148px]', padding: 'pl-6 pr-4 pb-6 pt-6' }}
      {...(onClick
        ? { onClick: onClick as React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement> }
        : {})}
      role="button"
      tabIndex={0}
      aria-label={(ariaLabel || defaultAriaLabel) as string}
      onKeyDown={handleKeyDown}
      className={cn('group relative w-full', className)}
      {...props}
    >
      <div className="absolute top-4 right-4">
        <FolderContextMenu onDelete={onDelete} onRename={onRename} onColorChange={onColorChange} />
      </div>

      <div className="flex h-full w-full flex-1 flex-col gap-3">
        <div className="flex items-center gap-4 min-w-0 pr-8 sm:pr-12">
          <FolderGlyph folder={folder}>
            <span className="absolute -top-1.5 -right-1.5 select-none rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
              {bookmarkCount}
            </span>
          </FolderGlyph>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 truncate text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
              {folder.name}
            </h3>
            <p className="text-sm font-medium text-muted">
              {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'}
            </p>
          </div>
        </div>

        {/* Verse preview chips */}
        <div className="mt-auto flex w-full items-end gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {versePreview.map((b) => (
              <span
                key={String(b.verseId)}
                className="inline-flex shrink-0 items-center rounded-full bg-surface whitespace-nowrap leading-none px-2.5 py-1 text-[11px] font-medium text-muted transition-colors duration-200 group-hover:text-foreground/80 border border-border/40"
              >
                {b.verseKey || b.verseId}
              </span>
            ))}
            {remainingCount > 0 ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-surface whitespace-nowrap leading-none px-2.5 py-1 text-[11px] font-medium text-muted transition-colors duration-200 group-hover:text-foreground/80 border border-border/40">
                +{remainingCount}
              </span>
            ) : null}
          </div>
          {formattedUpdatedAt ? (
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-muted/80 whitespace-nowrap text-right">
              <ClockIcon className="h-3.5 w-3.5" />
              {formattedUpdatedAt}
            </span>
          ) : null}
        </div>
      </div>
    </BaseCard>
  );
});
