'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Folder } from '@/types';

import { FolderPreview } from './FolderPreview';
import { ModalActions } from './ModalActions';
import { ModalHeader } from './ModalHeader';
import { WarningMessage } from './WarningMessage';

interface ModalBodyProps {
  folder: Folder;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  error?: string | null;
}

export const ModalBody = ({
  folder,
  onClose,
  onDelete,
  isDeleting,
  error,
}: ModalBodyProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div>
      <ModalHeader onClose={onClose} />

      <div className="px-6 pb-6">
        <FolderPreview folder={folder} />

        <div className="space-y-4">
          <p className="text-foreground">{t('delete_folder_confirm')}</p>
          <WarningMessage folder={folder} />
          {error && (
            <p role="alert" className="text-error text-sm">
              {error}
            </p>
          )}
        </div>

        <ModalActions onDelete={onDelete} isDeleting={isDeleting} />
      </div>
    </div>
  );
};
