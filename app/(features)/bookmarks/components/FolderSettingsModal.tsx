'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { Folder } from '@/types';

import { ColorSelector } from './folder-settings/ColorSelector';
import { FolderNameInput } from './folder-settings/FolderNameInput';
import { IconSelector } from './folder-settings/IconSelector';
import { ModalActions } from './folder-settings/ModalActions';
import { useFolderSettings } from './folder-settings/useFolderSettings';

interface FolderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  mode: 'edit' | 'rename' | 'customize';
}

export const FolderSettingsModal = ({
  isOpen,
  onClose,
  folder,
  mode,
}: FolderSettingsModalProps): React.JSX.Element => {
  const {
    name,
    setName,
    selectedColor,
    setSelectedColor,
    selectedIcon,
    setSelectedIcon,
    isSubmitting,
    handleSubmit,
    getModalTitle,
  } = useFolderSettings({ folder, mode, onClose, isOpen });

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
            role="dialog"
            aria-modal="true"
            aria-labelledby="folder-settings-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="folder-settings-title" className="text-xl font-semibold text-foreground">
                {getModalTitle()}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted hover:bg-surface-hover hover:text-accent transition-colors"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <FolderNameInput name={name} setName={setName} />
              {mode === 'customize' && (
                <>
                  <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                  <IconSelector selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />
                </>
              )}
              <ModalActions isSubmitting={isSubmitting} onClose={onClose} />
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

