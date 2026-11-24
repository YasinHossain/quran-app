'use client';

import React from 'react';

import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';
import { Folder } from '@/types';

import { useFolderSettings } from './folder-settings/useFolderSettings';
import { ModalHeader, SettingsForm } from './folder-settings-modal';

interface FolderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  mode?: 'edit' | 'create';
}

export const FolderSettingsModal = ({
  isOpen,
  onClose,
  folder,
  mode = 'edit',
}: FolderSettingsModalProps): React.JSX.Element => {
  const {
    name,
    setName,
    selectedColor,
    setSelectedColor,
    isSubmitting,
    handleSubmit,
    getModalTitle,
    submitLabel,
    submittingLabel,
  } = useFolderSettings({ folder, onClose, isOpen, mode });

  const shouldRender = mode === 'edit' ? isOpen && Boolean(folder) : isOpen;

  return (
    <UnifiedModal
      isOpen={shouldRender}
      onClose={onClose}
      closeOnEscape={false}
      ariaLabelledBy="folder-settings-title"
      contentClassName="max-w-md mx-auto p-6"
    >
      <ModalHeader title={getModalTitle()} onClose={onClose} />

      <SettingsForm
        name={name}
        setName={setName}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        onClose={onClose}
        submitLabel={submitLabel}
        submittingLabel={submittingLabel}
      />
    </UnifiedModal>
  );
};
