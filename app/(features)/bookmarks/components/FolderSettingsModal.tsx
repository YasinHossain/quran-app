'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CloseIcon } from '@/app/shared/icons';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Folder } from '@/types';

import React from 'react';

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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const getModalTitle = () => {
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
              {/* Folder Name */}
              <div className="mb-6">
                <label
                  htmlFor="folder-name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
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

              {/* Color Selection - Only show for customize mode */}
              {mode === 'customize' && (
                <div className="mb-6">
                  <fieldset>
                    <legend className="block text-sm font-medium text-foreground mb-3">
                      Folder Color
                    </legend>
                    <div className="grid grid-cols-4 gap-2">
                      {FOLDER_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            selectedColor === color.value
                              ? 'border-accent scale-105'
                              : 'border-border hover:border-accent/50'
                          } ${color.value.replace('text-', 'bg-')}`}
                          aria-label={`Select ${color.name} color`}
                        >
                          {selectedColor === color.value && (
                            <div className="w-full h-full rounded-md flex items-center justify-center text-white">
                              ✓
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {/* Icon Selection - Only show for customize mode */}
              {mode === 'customize' && (
                <div className="mb-6">
                  <fieldset>
                    <legend className="block text-sm font-medium text-foreground mb-3">
                      Folder Icon
                    </legend>
                    <div className="grid grid-cols-4 gap-2">
                      {FOLDER_ICONS.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setSelectedIcon(icon)}
                          className={`w-12 h-12 rounded-lg border-2 text-xl transition-all ${
                            selectedIcon === icon
                              ? 'border-accent bg-accent/10 scale-105'
                              : 'border-border hover:border-accent/50 hover:bg-surface-hover'
                          }`}
                          aria-label={`Select ${icon} icon`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
