'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import { BookmarkTab } from './components/BookmarkTab';
import { PinTab } from './components/PinTab';
import { TabNavigation } from './components/TabNavigation';
import { BookmarkModalProps } from './types';
import { useBookmarkModal } from './useBookmarkModal';

export const BookmarkModal = memo(function BookmarkModal({
  isOpen,
  onClose,
  verseId,
  verseKey = '',
}: BookmarkModalProps): React.JSX.Element {
  const {
    activeTab,
    setActiveTab,
    isCreatingFolder,
    openCreateFolder,
    closeCreateFolder,
    newFolderName,
    setNewFolderName,
  } = useBookmarkModal(isOpen, onClose);

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
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
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal touch-none"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="fixed inset-0 flex items-center justify-center z-modal p-4 pointer-events-none"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Bookmark options"
              className="bg-surface rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col pointer-events-auto"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-full hover:bg-interactive transition-colors',
                    touchClasses.target,
                    touchClasses.focus
                  )}
                  aria-label="Close"
                >
                  <CloseIcon size={20} className="text-muted" />
                </button>
              </div>

              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} verseKey={verseKey} />

              <AnimatePresence mode="wait">
                {activeTab === 'pin' ? (
                  <motion.div
                    key="pin"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 overflow-hidden"
                  >
                    <PinTab verseId={verseId} verseKey={verseKey} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="bookmark"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 overflow-hidden flex flex-col"
                  >
                    <BookmarkTab
                      verseId={verseId}
                      isCreatingFolder={isCreatingFolder}
                      newFolderName={newFolderName}
                      onToggleCreateFolder={(creating) =>
                        creating ? openCreateFolder() : closeCreateFolder()
                      }
                      onNewFolderNameChange={setNewFolderName}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
