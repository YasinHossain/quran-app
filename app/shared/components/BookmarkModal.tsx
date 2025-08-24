'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { SearchIcon, FolderIcon, PlusIcon, CloseIcon } from '@/app/shared/icons';
import { Folder } from '@/types';
import { touchClasses } from '@/lib/responsive';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseId: string;
  verseKey?: string;
}

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
  
  const [activeTab, setActiveTab] = useState<'bookmark' | 'pin'>('bookmark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const isVerseBookmarked = findBookmark(verseId);
  const isVersePinned = isPinned(verseId);

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    return folders.filter(folder =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const handleFolderSelect = (folder: Folder) => {
    const existingBookmark = findBookmark(verseId);
    
    if (existingBookmark && existingBookmark.folder.id === folder.id) {
      // Remove bookmark from this folder
      removeBookmark(verseId, folder.id);
    } else {
      // Add bookmark to this folder (remove from existing folder if any)
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

  const handleDone = () => {
    onClose();
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
            onClick={onClose}
          >
            <div
              className="bg-surface rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Add to Collections
                  </h2>
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

                {/* Tabs */}
                <div className="flex bg-interactive rounded-2xl p-1">
                  <button
                    onClick={() => setActiveTab('bookmark')}
                    className={cn(
                      'flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-all',
                      touchClasses.target,
                      touchClasses.focus,
                      activeTab === 'bookmark'
                        ? 'bg-surface text-foreground shadow-sm'
                        : 'text-muted hover:text-foreground'
                    )}
                  >
                    Bookmark
                  </button>
                  <button
                    onClick={() => setActiveTab('pin')}
                    className={cn(
                      'flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-all',
                      touchClasses.target,
                      touchClasses.focus,
                      activeTab === 'pin'
                        ? 'bg-surface text-foreground shadow-sm'
                        : 'text-muted hover:text-foreground'
                    )}
                  >
                    Pin
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'bookmark' ? (
                  <>
                    {/* Search Bar */}
                    <div className="px-6 py-4 border-b border-border">
                      <div className="relative">
                        <SearchIcon
                          width={20}
                          height={20}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted"
                        />
                        <input
                          type="text"
                          placeholder="Search Bookmark Folder"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={cn(
                            'w-full pl-12 pr-4 py-3 bg-interactive border border-border rounded-2xl',
                            'text-foreground placeholder-muted text-sm',
                            'focus:outline-none focus:border-accent transition-colors',
                            touchClasses.focus
                          )}
                        />
                      </div>
                    </div>

                    {/* Folder List */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <div className="space-y-2">
                        {filteredFolders.map((folder) => {
                          const isSelected = isVerseBookmarked?.folder.id === folder.id;
                          return (
                            <button
                              key={folder.id}
                              onClick={() => handleFolderSelect(folder)}
                              className={cn(
                                'flex items-center gap-4 p-4 rounded-2xl transition-all w-full text-left',
                                touchClasses.target,
                                touchClasses.gesture,
                                isSelected
                                  ? 'bg-accent/10 border border-accent/20'
                                  : 'hover:bg-interactive border border-transparent'
                              )}
                            >
                              <div className="flex-shrink-0">
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center',
                                    isSelected
                                      ? 'bg-accent text-surface'
                                      : 'bg-interactive text-muted'
                                  )}
                                >
                                  <FolderIcon size={16} />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground text-sm truncate">
                                  {folder.name}
                                </div>
                                <div className="text-xs text-muted mt-0.5">
                                  {folder.bookmarks.length} verse{folder.bookmarks.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                              {isSelected && (
                                <div className="flex-shrink-0">
                                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-surface" />
                                  </div>
                                </div>
                              )}
                            </button>
                          );
                        })}

                        {/* Create New Folder */}
                        {isCreatingFolder ? (
                          <div className="p-4 border-2 border-dashed border-border rounded-2xl">
                            <input
                              type="text"
                              placeholder="Enter folder name"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleCreateFolder();
                                } else if (e.key === 'Escape') {
                                  setIsCreatingFolder(false);
                                  setNewFolderName('');
                                }
                              }}
                              className={cn(
                                'w-full px-3 py-2 bg-transparent border border-border rounded-xl',
                                'text-foreground placeholder-muted text-sm',
                                'focus:outline-none focus:border-accent transition-colors',
                                touchClasses.focus
                              )}
                              autoFocus
                            />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={handleCreateFolder}
                                disabled={!newFolderName.trim()}
                                className={cn(
                                  'px-4 py-2 bg-accent text-surface rounded-xl text-sm font-medium',
                                  'disabled:opacity-50 disabled:cursor-not-allowed',
                                  touchClasses.target,
                                  touchClasses.focus
                                )}
                              >
                                Create
                              </button>
                              <button
                                onClick={() => {
                                  setIsCreatingFolder(false);
                                  setNewFolderName('');
                                }}
                                className={cn(
                                  'px-4 py-2 bg-interactive text-foreground rounded-xl text-sm font-medium',
                                  touchClasses.target,
                                  touchClasses.focus
                                )}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsCreatingFolder(true)}
                            className={cn(
                              'flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-border',
                              'hover:border-accent/50 hover:bg-accent/5 transition-all w-full text-left',
                              touchClasses.target,
                              touchClasses.gesture
                            )}
                          >
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <PlusIcon size={16} className="text-accent" />
                            </div>
                            <span className="text-sm font-medium text-accent">
                              Create New Folder
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // Pin Tab Content
                  <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                    <div className="text-center">
                      <div className={cn(
                        'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center',
                        isVersePinned ? 'bg-accent/10' : 'bg-interactive'
                      )}>
                        <div className={cn(
                          'text-2xl',
                          isVersePinned ? 'text-accent' : 'text-muted'
                        )}>
                          📌
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {isVersePinned ? 'Pinned Verse' : 'Pin this Verse'}
                      </h3>
                      <p className="text-sm text-muted mb-6 leading-relaxed max-w-sm">
                        {isVersePinned
                          ? 'This verse is pinned to your collection for quick access.'
                          : 'Pin this verse to keep it easily accessible at the top of your collection.'
                        }
                      </p>
                      <button
                        onClick={handleTogglePin}
                        className={cn(
                          'px-6 py-3 rounded-2xl text-sm font-medium transition-colors',
                          touchClasses.target,
                          touchClasses.focus,
                          isVersePinned
                            ? 'bg-interactive text-foreground hover:bg-accent/10'
                            : 'bg-accent text-surface hover:bg-accent/90'
                        )}
                      >
                        {isVersePinned ? 'Unpin Verse' : 'Pin Verse'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border">
                <button
                  onClick={handleDone}
                  className={cn(
                    'w-full py-3 bg-accent text-surface rounded-2xl text-sm font-semibold',
                    'hover:bg-accent/90 transition-colors',
                    touchClasses.target,
                    touchClasses.focus
                  )}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookmarkModal;