import { motion } from 'framer-motion';
import React from 'react';

import { Folder } from '@/types';

import { ModalHeader } from './ModalHeader';
import { FolderPreview } from './FolderPreview';
import { WarningMessage } from './WarningMessage';
import { ModalActions } from './ModalActions';
import { MODAL_VARIANTS } from './animations';

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
  <motion.div
    variants={MODAL_VARIANTS}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-border rounded-2xl shadow-modal z-modal"
  >
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
  </motion.div>
);
