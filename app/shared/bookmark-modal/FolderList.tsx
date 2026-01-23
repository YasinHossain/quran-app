'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { FolderIcon, CheckIcon } from '@/app/shared/icons';
import { FolderGlyph } from '@/app/shared/ui/cards/FolderGlyph';
import { touchClasses } from '@/lib/responsive';
import { formatNumber } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';
import { Folder, Bookmark } from '@/types';

const getButtonClasses = (isSelected: boolean): string =>
  cn(
    'w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200 text-left tap-scale',
    isSelected
      ? 'bg-accent border border-accent'
      : 'hover:bg-interactive-hover border border-transparent',
    touchClasses.target,
    touchClasses.focus
  );

const getTitleClasses = (isSelected: boolean): string =>
  cn('flex-1 font-medium truncate', isSelected ? 'text-white' : 'text-foreground');

interface FolderListItemProps {
  folder: Folder;
  isSelected: boolean;
  onSelect: (folder: Folder) => void;
}

const FolderListItem = memo(function FolderListItem({
  folder,
  isSelected,
  onSelect,
}: FolderListItemProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const bookmarkCount: number = folder.bookmarks?.length || 0;
  const formattedCount = formatNumber(bookmarkCount, i18n.language, { useGrouping: false });
  const unitLabel = bookmarkCount === 1 ? t('verse') : t('verses');

  return (
    <button onClick={(): void => onSelect(folder)} className={getButtonClasses(isSelected)}>
      <FolderGlyph folder={folder} size="md" className={isSelected ? 'border border-white' : ''} />

      <div className="flex-1 min-w-0">
        <h3 className={getTitleClasses(isSelected)}>{folder.name}</h3>
        <p className={cn('text-sm', isSelected ? 'text-white/80' : 'text-muted')}>
          {formattedCount} {unitLabel}
        </p>
      </div>

      {isSelected && <CheckIcon size={20} className="text-white flex-shrink-0" />}
    </button>
  );
});

const EmptyState = memo(function EmptyState({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <FolderIcon size={24} className="text-muted" />
      </div>
      <p className="text-muted">{message}</p>
    </div>
  );
});

interface FolderListProps {
  folders: Folder[];
  verseId: string;
  onFolderSelect: (folder: Folder) => void;
  emptyMessage?: string;
}

export const FolderList = memo(function FolderList({
  folders,
  verseId,
  onFolderSelect,
  emptyMessage,
}: FolderListProps): React.JSX.Element {
  const { t } = useTranslation();
  if (!folders.length)
    return <EmptyState message={emptyMessage ?? t('bookmarks_no_folders_found')} />;

  return (
    <div className="space-y-2 w-full mx-auto">
      {folders.map(
        (folder: Folder): React.JSX.Element => (
          <FolderListItem
            key={folder.id}
            folder={folder}
            isSelected={folder.bookmarks.some(
              (bookmark: Bookmark) => String(bookmark.verseId) === String(verseId)
            )}
            onSelect={onFolderSelect}
          />
        )
      )}
    </div>
  );
});
