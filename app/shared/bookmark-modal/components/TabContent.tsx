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
}

export function TabContent({
  activeTab,
  verseId,
  verseKey,
  isCreatingFolder,
  newFolderName,
  onToggleCreateFolder,
  onNewFolderNameChange,
}: TabContentProps): JSX.Element {
  return (
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
