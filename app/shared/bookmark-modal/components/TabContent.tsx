'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { BookmarkTab } from './BookmarkTab';
import { PinTab } from './PinTab';

import type { JSX } from 'react';

interface TabContentProps {
  activeTab: 'pin' | 'bookmark';
  verseId: string;
  verseKey: string;
  isCreatingFolder: boolean;
  newFolderName: string;
  onToggleCreateFolder: (creating: boolean) => void;
  onNewFolderNameChange: (name: string) => void;
  onClose?: () => void;
}

export function TabContent({
  activeTab,
  verseId,
  verseKey,
  isCreatingFolder,
  newFolderName,
  onToggleCreateFolder,
  onNewFolderNameChange,
  onClose,
}: TabContentProps): JSX.Element {
  return (
    <AnimatePresence mode="wait">
      {activeTab === 'pin' ? (
        <motion.div
          key="pin"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex-1 overflow-hidden min-h-0"
        >
          <PinTab verseId={verseId} verseKey={verseKey} onClose={onClose} />
        </motion.div>
      ) : (
        <motion.div
          key="bookmark"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex-1 overflow-hidden flex flex-col min-h-0"
        >
          <BookmarkTab
            verseId={verseId}
            verseKey={verseKey}
            isCreatingFolder={isCreatingFolder}
            newFolderName={newFolderName}
            onToggleCreateFolder={onToggleCreateFolder}
            onNewFolderNameChange={onNewFolderNameChange}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
