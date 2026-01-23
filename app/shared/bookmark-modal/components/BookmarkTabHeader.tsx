'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateFolderForm } from '@/app/shared/bookmark-modal/CreateFolderForm';
import { PlusIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface BookmarkTabHeaderProps {
  isCreatingFolder: boolean;
  newFolderName: string;
  onNewFolderNameChange: (name: string) => void;
  onToggleCreateFolder: (creating: boolean) => void;
  onCreateFolder: () => void;
}

export const BookmarkTabHeader = memo(function BookmarkTabHeader({
  isCreatingFolder,
  newFolderName,
  onNewFolderNameChange,
  onToggleCreateFolder,
  onCreateFolder,
}: BookmarkTabHeaderProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="px-3 py-4 border-b border-border">
      {isCreatingFolder ? (
        <CreateFolderForm
          newFolderName={newFolderName}
          onNameChange={onNewFolderNameChange}
          onCreateFolder={onCreateFolder}
        />
      ) : (
        <button
          onClick={() => onToggleCreateFolder(true)}
          className={cn(
            'w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border rounded-xl',
            'hover:border-accent hover:bg-accent/5 transition-colors text-muted hover:text-accent',
            'tap-scale',
            touchClasses.target,
            touchClasses.focus
          )}
        >
          <PlusIcon size={20} />
          <span className="font-medium">{t('bookmarks_create_folder')}</span>
        </button>
      )}
    </div>
  );
});
