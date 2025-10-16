'use client';

import type { KeyboardEvent } from 'react';

import { ClockIcon, ChevronDownIcon } from '@/app/shared/icons';
import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';
import { cn } from '@/lib/utils/cn';

import type { Folder } from '@/types/bookmark';

import { FolderGlyph } from './FolderGlyph';
import { applyOpacity, resolveAccentColor } from './folderColor.utils';

interface BookmarkFolderCardProps extends Omit<BaseCardProps, 'children'> {
  folder: Folder;
  isExpanded?: boolean;
  onToggleExpansion?: (folderId: string) => void;
}

export const BookmarkFolderCard = ({
  folder,
  isExpanded = false,
  onToggleExpansion,
  className,
  ...props
}: BookmarkFolderCardProps): React.JSX.Element => {
  const handleClick = (): void => {
    onToggleExpansion?.(folder.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const accentColor = resolveAccentColor(folder.color);
  const verseCount = folder.bookmarks.length;
  const latestBookmarkTimestamp =
    verseCount > 0
      ? folder.bookmarks.reduce(
          (latest, bookmark) => Math.max(latest, bookmark.createdAt ?? 0),
          folder.createdAt ?? 0
        )
      : (folder.createdAt ?? 0);
  const formattedUpdatedAt =
    latestBookmarkTimestamp > 0
      ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
          new Date(latestBookmarkTimestamp)
        )
      : null;
  const versePreview = folder.bookmarks.slice(0, 3);

  return (
    <BaseCard
      variant="folder"
      animation="folder"
      customVariant={{ padding: 'p-0' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Toggle folder ${folder.name}`}
      data-expanded={isExpanded}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/40 bg-surface/80 backdrop-blur-sm transition-all duration-300',
        'hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:bg-surface-hover',
        'data-[expanded=true]:border-accent/40 data-[expanded=true]:shadow-lg data-[expanded=true]:bg-surface-hover',
        className as string
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${applyOpacity(accentColor, 0.16)} 0%, transparent 60%)`,
        }}
      />
      <div className="relative flex items-start gap-4 p-4 sm:p-5">
        <FolderGlyph folder={folder}>
          <span className="absolute -top-1.5 -right-1.5 select-none rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
            {verseCount}
          </span>
        </FolderGlyph>

        <div className="flex flex-1 flex-col gap-3 min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground line-clamp-1">
                {folder.name}
              </div>
              {verseCount > 0 ? (
                <div className="text-xs text-muted/80">
                  {verseCount} verse{verseCount !== 1 ? 's' : ''}
                </div>
              ) : (
                <div className="text-xs text-muted/70">No verses yet</div>
              )}
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface hover:bg-surface-hover transition-colors">
              <ChevronDownIcon
                className={cn(
                  'h-4 w-4 text-muted transition-transform duration-300',
                  isExpanded && 'rotate-180 text-accent'
                )}
              />
            </div>
          </div>

          {verseCount > 0 ? (
            <div className="flex-1 min-w-0 flex items-center gap-1 sm:gap-1.5 overflow-hidden">
              {versePreview.map((bookmark) => (
                <span
                  key={String(bookmark.verseId)}
                  className="inline-flex shrink-0 items-center rounded-full bg-surface whitespace-nowrap leading-none px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-[11px] font-medium text-muted transition-colors duration-200 group-hover:text-foreground/80"
                >
                  {bookmark.verseKey || bookmark.verseId}
                </span>
              ))}
              {verseCount > versePreview.length && (
                <span className="shrink-0 whitespace-nowrap leading-none text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-muted/70">
                  +{verseCount - versePreview.length} more
                </span>
              )}
            </div>
          ) : null}

          {formattedUpdatedAt ? (
            <div className="mt-auto self-end flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted/60">
              <ClockIcon className="h-3.5 w-3.5" />
              {formattedUpdatedAt}
            </div>
          ) : null}
        </div>
      </div>
    </BaseCard>
  );
};
