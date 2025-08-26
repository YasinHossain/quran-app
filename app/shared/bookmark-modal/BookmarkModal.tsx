'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CloseIcon } from '@/app/shared/icons';
import { Folder } from '@/types';
import { touchClasses } from '@/lib/responsive';
import TabNavigation from './TabNavigation';
import BookmarkTab from './BookmarkTab';
import PinTab from './PinTab';
import { BookmarkModalProps } from './types';

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  verseId,
  verseKey = '',
}) => {
  const {
    folders,
    addBookmark,
    removeBookmark,
    findBookmark,
    togglePinned,
    isPinned,
    createFolder,
  } = useBookmarks();

  const [activeTab, setActiveTab] = useState<'bookmark' | 'pin'>('pin');
  const [searchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const isVersePinned = isPinned(verseId);

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const handleFolderSelect = (folder: Folder) => {
    const existingBookmark = findBookmark(verseId);

    if (existingBookmark && existingBookmark.folder.id === folder.id) {
      removeBookmark(verseId, folder.id);
    } else {
      if (existingBookmark) {
        removeBookmark(verseId, existingBookmark.folder.id);
      }
      addBookmark(verseId, folder.id);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleTogglePin = () => {
    togglePinned(verseId);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal touch-none"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
            }}
            className="fixed inset-0 flex items-center justify-center z-modal p-4 pointer-events-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClose();
              }
            }}
            onClick={onClose}
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="bg-surface rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close Button */}
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

              {/* Tab Navigation */}
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} verseKey={verseKey} />

              {/* Tab Content */}
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

export default BookmarkModal;
