'use client';

import { ChevronDownIcon } from '@/app/shared/icons';
import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';
import { cn } from '@/lib/utils/cn';

import type { Folder } from '@/types/bookmark';

/**
 * BookmarkFolderCard
 *
 * Specialized folder card for bookmark sidebar that maintains current design
 * while using the unified BaseCard system for consistent hover/animation behavior.
 */

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
  const handleClick = () => {
    onToggleExpansion?.(folder.id);
  };

  return (
    <BaseCard
      variant="navigation" // Use navigation variant for consistent hover behavior
      animation="navigation"
      onClick={handleClick}
      className={cn(
        // Override with folder-specific styles while maintaining base structure
        'p-3 rounded-lg border transition-all duration-200 cursor-pointer group h-auto',
        'bg-surface border-border hover:border-accent/30 hover:bg-surface-hover hover:shadow-sm',
        className as string
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-accent text-sm font-semibold"
            style={{
              // Use folder color if provided, otherwise fall back to accent token
              backgroundColor: folder.color || 'rgb(var(--color-accent))',
            }}
          >
            {folder.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{folder.name}</div>
            <div className="text-xs text-muted">
              {folder.bookmarks.length} verse{folder.bookmarks.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <ChevronDownIcon
          className={cn(
            'w-4 h-4 text-muted transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </div>
    </BaseCard>
  );
};
