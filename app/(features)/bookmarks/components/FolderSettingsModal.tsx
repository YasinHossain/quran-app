'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

import { Folder } from '@/types';

import { useFolderSettings } from './folder-settings/useFolderSettings';
import {
  ModalHeader,
  SettingsForm,
  useFolderSettingsModalAnimation,
} from './folder-settings-modal';

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

  const { backdropVariants, modalVariants } = useFolderSettingsModalAnimation();

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
            <ModalHeader title={getModalTitle()} onClose={onClose} />

            <SettingsForm
              mode={mode}
              name={name}
              setName={setName}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
