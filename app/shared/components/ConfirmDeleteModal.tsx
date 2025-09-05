'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal = ({
  isOpen,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item?',
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps): JSX.Element => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal"
            onClick={onCancel}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-modal"
          >
            <div
              role="dialog"
              aria-modal="true"
              className="bg-surface border border-border rounded-2xl shadow-modal p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
              <p className="text-foreground mb-6">{description}</p>
              <div className="flex justify-end gap-3">
                <button
                  ref={cancelRef}
                  onClick={onCancel}
                  aria-label="Cancel delete"
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  aria-label="Confirm delete"
                  className="px-4 py-2 text-sm font-medium bg-error text-on-error rounded-lg hover:bg-error/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
