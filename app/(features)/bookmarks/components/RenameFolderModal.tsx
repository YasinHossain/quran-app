'use client';

import { useEffect, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Button } from '@/app/shared/ui/Button';
import { PanelModalCenter } from '@/app/shared/ui/PanelModalCenter';
import { cn } from '@/lib/utils/cn';

import type { Folder } from '@/types';

interface RenameFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export const RenameFolderModal = ({
  isOpen,
  onClose,
  folder,
}: RenameFolderModalProps): React.JSX.Element | null => {
  const { renameFolder } = useBookmarks();
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (!isOpen || !folder) return;
    setFolderName(folder.name ?? '');
  }, [folder, isOpen]);

  const handleClose = (): void => {
    onClose();
    setFolderName('');
  };

  const handleSubmit = (event?: React.FormEvent): void => {
    event?.preventDefault();
    if (!folder) return;
    const trimmedName = folderName.trim();
    if (!trimmedName || trimmedName === folder.name) {
      handleClose();
      return;
    }
    renameFolder(folder.id, trimmedName);
    handleClose();
  };

  if (!isOpen || !folder) return null;

  const trimmedName = folderName.trim();
  const isUnchanged = trimmedName === (folder.name ?? '').trim();
  const isSubmitDisabled = trimmedName.length === 0 || isUnchanged;

  return (
    <PanelModalCenter
      isOpen={isOpen}
      onClose={handleClose}
      title="Rename Folder"
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="rename-folder-name"
            className="block text-sm font-semibold text-foreground"
          >
            Folder Name
          </label>
          <input
            id="rename-folder-name"
            type="text"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            placeholder="Enter a new folder name"
            className={cn(
              'w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted transition-all duration-200 shadow-sm',
              'focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none'
            )}
            maxLength={50}
            autoFocus
          />
          <div className="text-xs text-muted">{folderName.length}/50</div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleClose} className="px-6 py-2.5">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitDisabled}
            className="px-6 py-2.5"
          >
            Save
          </Button>
        </div>
      </form>
    </PanelModalCenter>
  );
};
