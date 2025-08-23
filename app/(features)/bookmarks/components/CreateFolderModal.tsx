'use client';

import { useState } from 'react';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Panel } from '@/app/shared/ui/Panel';
import { Button } from '@/app/shared/ui/Button';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFolderModal = ({ isOpen, onClose }: CreateFolderModalProps) => {
  const [folderName, setFolderName] = useState('');
  const { createFolder } = useBookmarks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      createFolder(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      variant="modal-center"
      title="Create New Folder"
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
          className="w-full rounded-md border border-input-border bg-input-background px-4 py-2 text-sm text-foreground placeholder-input-placeholder focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!folderName.trim()}>
            Create Folder
          </Button>
        </div>
      </form>
    </Panel>
  );
};
