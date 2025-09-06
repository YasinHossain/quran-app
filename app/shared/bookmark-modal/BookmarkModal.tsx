'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { CloseIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import { BookmarkTab } from './components/BookmarkTab';
import { PinTab } from './components/PinTab';
import { TabNavigation } from './components/TabNavigation';
import { useBookmarkModal } from './useBookmarkModal';
import { BookmarkModalProps } from './types';

export const BookmarkModal = memo(function BookmarkModal({
  isOpen,
  onClose,
  verseId,
  verseKey = '',
}: BookmarkModalProps): React.JSX.Element {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isCreatingFolder,
    setIsCreatingFolder,
    newFolderName,
    setNewFolderName,
    filteredFolders,
    handleFolderSelect,
    handleCreateFolder,
    handleTogglePin,
    isVersePinned,
    findBookmark,
  } = useBookmarkModal(isOpen, verseId, onClose);

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

              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                verseKey={verseKey}
              />

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
                    <PinTab
                      verseId={verseId}
                      verseKey={verseKey}
                      isVersePinned={isVersePinned}
                      onTogglePin={handleTogglePin}
                    />
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
                      folders={filteredFolders}
                      verseId={verseId}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      isCreatingFolder={isCreatingFolder}
                      newFolderName={newFolderName}
                      onFolderSelect={handleFolderSelect}
                      onCreateFolder={handleCreateFolder}
                      onToggleCreateFolder={setIsCreatingFolder}
                      onNewFolderNameChange={setNewFolderName}
                      findBookmark={findBookmark}
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
};

