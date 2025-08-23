'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from '@/app/shared/icons';
import { Folder } from '@/types';
import { useBookmarks } from '@/app/providers/BookmarkContext';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  isOpen,
  onClose,
  folder,
}) => {
  const { deleteFolder } = useBookmarks();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!folder) return;

    setIsDeleting(true);
    try {
      deleteFolder(folder.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete folder:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <AnimatePresence>
      {isOpen && folder && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border rounded-2xl shadow-modal z-modal p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Delete Folder</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted hover:bg-surface-hover hover:text-accent transition-colors"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-foreground mb-4">
                Are you sure you want to delete the folder{' '}
                <strong>&quot;{folder.name}&quot;</strong>?
              </p>

              {folder.bookmarks.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <p className="text-orange-800 dark:text-orange-200 text-sm">
                    <strong>Warning:</strong> This folder contains {folder.bookmarks.length}{' '}
                    bookmark
                    {folder.bookmarks.length === 1 ? '' : 's'}. All bookmarks in this folder will be
                    permanently deleted.
                  </p>
                </div>
              )}

              <p className="text-muted text-sm mt-4">This action cannot be undone.</p>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Folder'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
