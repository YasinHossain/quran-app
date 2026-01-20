'use client';

import React from 'react';

import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';
import { Folder } from '@/types';

import { ModalBody, useDeleteFolder } from './delete-folder-modal';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export const DeleteFolderModal = ({
  isOpen,
  onClose,
  folder,
}: DeleteFolderModalProps): React.JSX.Element => {
  const { handleDelete, isDeleting, error } = useDeleteFolder(folder, onClose);
  const shouldRender = isOpen && Boolean(folder);

  return (
    <UnifiedModal
      isOpen={shouldRender}
      onClose={onClose}
      ariaLabel="Delete folder"
      contentClassName="max-w-lg mx-auto overflow-hidden"
    >
      {folder && (
        <ModalBody
          folder={folder}
          onClose={onClose}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          error={error}
        />
      )}
    </UnifiedModal>
  );
};
