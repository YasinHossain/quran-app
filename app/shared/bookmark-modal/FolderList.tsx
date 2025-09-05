'use client';

import { motion } from 'framer-motion';

import { FolderIcon, CheckIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';
import { Folder, Bookmark } from '@/types';

interface FolderListProps {
  folders: Folder[];
  verseId: string;
  onFolderSelect: (folder: Folder) => void;
  findBookmark: (verseId: string) => { folder: Folder; bookmark: Bookmark } | null;
  emptyMessage?: string;
}

export const FolderList = ({
  folders,
  verseId,
  onFolderSelect,
  findBookmark,
  emptyMessage = 'No folders found',
}: FolderListProps): React.JSX.Element => {
  const existingBookmark = findBookmark(verseId);

  if (folders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <FolderIcon size={24} className="text-muted" />
        </div>
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {folders.map((folder) => {
        const isSelected = existingBookmark?.folder.id === folder.id;
        const bookmarkCount = folder.bookmarks?.length || 0;

        return (
          <motion.button
            key={folder.id}
            onClick={() => onFolderSelect(folder)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left',
              isSelected
                ? 'bg-accent/10 border border-accent/20'
                : 'hover:bg-interactive border border-transparent',
              touchClasses.target,
              touchClasses.focus
            )}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center',
                folder.color ? `bg-[${folder.color}]` : 'bg-surface-secondary'
              )}
            >
              <FolderIcon size={20} className={isSelected ? 'text-accent' : 'text-foreground'} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    'font-medium truncate',
                    isSelected ? 'text-accent' : 'text-foreground'
                  )}
                >
                  {folder.name}
                </h3>
                {isSelected && <CheckIcon size={16} className="text-accent flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted">
                {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
