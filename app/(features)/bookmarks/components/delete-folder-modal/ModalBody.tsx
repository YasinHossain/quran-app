import React from 'react';

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
}: ModalBodyProps): React.JSX.Element => (
  <div>
    <ModalHeader onClose={onClose} />

    <div className="px-6 pb-6">
      <FolderPreview folder={folder} />

      <div className="space-y-4">
        <p className="text-foreground">Are you sure you want to permanently delete this folder?</p>
        <WarningMessage folder={folder} />
        {error && (
          <p role="alert" className="text-error text-sm">
            {error}
          </p>
        )}
      </div>

      <ModalActions onClose={onClose} onDelete={onDelete} isDeleting={isDeleting} />
    </div>
  </div>
);
