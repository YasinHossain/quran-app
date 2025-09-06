'use client';

import { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Panel } from '@/app/shared/ui/Panel';

import { ModalHeader, FolderInput, FormActions, QuickSuggestions } from './create-folder-modal';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFolderModal = ({
  isOpen,
  onClose,
}: CreateFolderModalProps): React.JSX.Element => {
  const [folderName, setFolderName] = useState('');
  const { createFolder } = useBookmarks();

  const handleSubmit = (e?: React.FormEvent): void => {
    e?.preventDefault();
    if (folderName.trim()) {
      createFolder(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  const handleClose = (): void => {
    setFolderName('');
    onClose();
  };

  const handleSuggestionClick = (suggestion: string): void => {
    setFolderName(suggestion);
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={handleClose}
      variant="modal-center"
      title=""
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <div className="p-6">
        <ModalHeader title="Create New Folder" description="Organize your bookmarked verses" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <FolderInput folderName={folderName} onFolderNameChange={setFolderName} />
          <FormActions
            onCancel={handleClose}
            onSubmit={() => handleSubmit()}
            isSubmitDisabled={!folderName.trim()}
          />
        </form>

        <QuickSuggestions onSuggestionClick={handleSuggestionClick} />
      </div>
    </Panel>
  );
};
