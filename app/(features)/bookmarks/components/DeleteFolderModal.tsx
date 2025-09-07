'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useCallback } from 'react';
import { Folder } from '@/types';

import { BACKDROP_VARIANTS, ModalBody, useDeleteFolder } from './delete-folder-modal';

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
  const { handleDelete: deleteFolder, isDeleting } = useDeleteFolder(folder, onClose);
  const handleDelete = useCallback(() => {
    deleteFolder();
  }, [deleteFolder]);

  return (
    <AnimatePresence>
      {isOpen && folder && (
        <>
          <motion.div
            variants={BACKDROP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal"
            onClick={onClose}
          />

          {/* Modal */}
          <ModalBody
            folder={folder}
            onClose={onClose}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </>
      )}
    </AnimatePresence>
  );
};