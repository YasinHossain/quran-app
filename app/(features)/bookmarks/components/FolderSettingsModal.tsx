'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import React from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CloseIcon } from '@/app/shared/icons';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Folder } from '@/types';

interface FolderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  mode: 'edit' | 'rename' | 'customize';
}

const FOLDER_COLORS = [
  { name: 'Accent', value: 'text-accent' },
  { name: 'Primary', value: 'text-primary' },
  { name: 'Interactive', value: 'text-interactive' },
  { name: 'Success', value: 'text-status-success' },
  { name: 'Warning', value: 'text-status-warning' },
  { name: 'Error', value: 'text-status-error' },
  { name: 'Info', value: 'text-status-info' },
  { name: 'Content Accent', value: 'text-content-accent' },
];

const FOLDER_ICONS = ['📁', '📖', '⭐', '💎', '🌟', '📚', '🔖', '💫'];

interface FolderNameInputProps {
  name: string;
  setName: (name: string) => void;
}

const FolderNameInput = ({ name, setName }: FolderNameInputProps): React.JSX.Element => (
  <div className="mb-6">
    <label htmlFor="folder-name" className="block text-sm font-medium text-foreground mb-2">
      Folder Name
    </label>
    <input
      id="folder-name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
      placeholder="Enter folder name"
      required
    />
  </div>
);

interface ColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ColorSelector = ({
  selectedColor,
  setSelectedColor,
}: ColorSelectorProps): React.JSX.Element => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-foreground mb-3">Color</label>
    <div className="grid grid-cols-4 gap-3">
      {FOLDER_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => setSelectedColor(color.value)}
          className={`p-3 rounded-lg border transition-all ${
            selectedColor === color.value
              ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
              : 'border-border hover:border-accent/50 hover:bg-surface-hover'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-current ${color.value} mx-auto`} />
          <span className="text-xs text-muted mt-1 block">{color.name}</span>
        </button>
      ))}
    </div>
  </div>
);

interface IconSelectorProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
}

const IconSelector = ({ selectedIcon, setSelectedIcon }: IconSelectorProps): React.JSX.Element => (
  <div className="mb-8">
    <label className="block text-sm font-medium text-foreground mb-3">Icon</label>
    <div className="grid grid-cols-4 gap-2">
      {FOLDER_ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => setSelectedIcon(icon)}
          className={`p-3 text-xl rounded-lg border transition-all ${
            selectedIcon === icon
              ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
              : 'border-border hover:border-accent/50 hover:bg-surface-hover'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  </div>
);

interface ModalActionsProps {
  isSubmitting: boolean;
  onClose: () => void;
}

const ModalActions = ({ isSubmitting, onClose }: ModalActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 pt-4">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-4 py-2 bg-accent text-on-accent rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Saving...' : 'Save Changes'}
    </button>
  </div>
);

export const FolderSettingsModal = ({
  isOpen,
  onClose,
  folder,
  mode,
}: FolderSettingsModalProps): React.JSX.Element => {
  const { renameFolder } = useBookmarks();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('text-accent');
  const [selectedIcon, setSelectedIcon] = useState('📁');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (folder && isOpen) {
      setName(folder.name);
      setSelectedColor(folder.color || 'text-accent');
      setSelectedIcon(folder.icon || '📁');
    }
  }, [folder, isOpen]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!folder || !name.trim()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'rename' || mode === 'edit' || mode === 'customize') {
        renameFolder(folder.id, name.trim(), selectedColor, selectedIcon);
      }
      onClose();
    } catch (error) {
      logger.error('Failed to update folder:', undefined, error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = (): string => {
    switch (mode) {
      case 'rename':
        return 'Rename Folder';
      case 'customize':
        return 'Customize Folder';
      case 'edit':
        return 'Edit Folder';
      default:
        return 'Edit Folder';
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
                  <ColorSelector
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                  />
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
