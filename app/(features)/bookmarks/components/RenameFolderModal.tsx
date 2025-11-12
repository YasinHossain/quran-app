'use client';

import { useEffect, useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  useRenameFormEffects(isOpen, folder, setFolderName, inputRef);

  const { handleClose, handleSubmit } = useRenameHandlers({
    renameFolder,
    onClose,
    folder,
    folderName,
    setFolderName,
  });

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
      <RenameFolderForm
        folderName={folderName}
        setFolderName={setFolderName}
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        inputRef={inputRef}
      />
    </PanelModalCenter>
  );
};

function useRenameFormEffects(
  isOpen: boolean,
  folder: Folder | null,
  setFolderName: (name: string) => void,
  inputRef: React.RefObject<HTMLInputElement | null>
): void {
  useEffect(() => {
    if (!isOpen || !folder) return;
    setFolderName(folder.name ?? '');
  }, [folder, isOpen, setFolderName]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen, folder?.id, inputRef]);
}

function useRenameHandlers({
  renameFolder,
  onClose,
  folder,
  folderName,
  setFolderName,
}: {
  renameFolder: (folderId: string, newName: string) => void;
  onClose: () => void;
  folder: Folder | null;
  folderName: string;
  setFolderName: (name: string) => void;
}): {
  handleClose: () => void;
  handleSubmit: (event?: React.FormEvent) => void;
} {
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

  return { handleClose, handleSubmit };
}

function RenameFolderForm({
  folderName,
  setFolderName,
  isSubmitDisabled,
  onSubmit,
  onCancel,
  inputRef,
}: {
  folderName: string;
  setFolderName: (name: string) => void;
  isSubmitDisabled: boolean;
  onSubmit: (event?: React.FormEvent) => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}): React.JSX.Element {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="rename-folder-name" className="block text-sm font-semibold text-foreground">
          Folder Name
        </label>
        <input
          id="rename-folder-name"
          type="text"
          value={folderName}
          onChange={(event) => setFolderName(event.target.value)}
          placeholder="Enter a new folder name"
          ref={inputRef}
          className={cn(
            'w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted transition-all duration-200 shadow-sm',
            'focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none'
          )}
          maxLength={50}
        />
        <div className="text-xs text-muted">{folderName.length}/50</div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-6 py-2.5">
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitDisabled} className="px-6 py-2.5">
          Save
        </Button>
      </div>
    </form>
  );
}
