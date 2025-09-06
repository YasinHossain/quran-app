'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Folder } from '@/types';

import {
  ModalHeader,
  FolderPreview,
  WarningMessage,
  ModalActions,
  BACKDROP_VARIANTS,
  MODAL_VARIANTS,
} from './delete-folder-modal';

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
  const { deleteFolder } = useBookmarks();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (): Promise<void> => {
    if (!folder) return;

    setIsDeleting(true);
    try {
      deleteFolder(folder.id);
      onClose();
    } catch (error) {
      logger.error('Failed to delete folder:', undefined, error as Error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && folder && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={BACKDROP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal"
            onClick={onClose}
          />

          {/* Modal */}
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
                <p className="text-foreground">
                  Are you sure you want to permanently delete this folder?
                </p>
                <WarningMessage folder={folder} />
              </div>

              <ModalActions onClose={onClose} onDelete={handleDelete} isDeleting={isDeleting} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
