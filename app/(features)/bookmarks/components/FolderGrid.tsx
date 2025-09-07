'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import { DeleteFolderModal } from './DeleteFolderModal';
import { EmptyBookmarks, EmptySearch } from './EmptyStates';
import { FolderCard } from './FolderCard';
import { FolderSettingsModal } from './FolderSettingsModal';

import type { Folder } from '@/types';

interface FolderGridProps {
  folders: Folder[];
  allFolders: Folder[];
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
  searchTerm: string;
  onClearSearch: () => void;
}

const renderEmptyState = (
  allFolders: Folder[],
  searchTerm: string,
  onCreateFolder: () => void,
  onClearSearch: () => void
): React.JSX.Element => {
  if (allFolders.length === 0) {
    return <EmptyBookmarks onCreateFolder={onCreateFolder} />;
  }
  if (searchTerm) {
    return <EmptySearch searchTerm={searchTerm} onClearSearch={onClearSearch} />;
  }
  return (
    <div className="mt-10 text-center text-muted">
      <p>No folders found.</p>
    </div>
  );
};

const renderFolderCard = (
  folder: Folder,
  index: number,
  onFolderSelect: (folderId: string) => void,
  handleFolderAction: (folder: Folder, action: 'edit' | 'delete' | 'rename' | 'customize') => void
): React.JSX.Element => (
  <motion.div
    key={folder.id}
    layout
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: 'easeOut',
      },
    }}
    exit={{
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: { duration: 0.3 },
    }}
  >
    <FolderCard
      folder={folder}
      onClick={() => onFolderSelect(folder.id)}
      onEdit={() => handleFolderAction(folder, 'edit')}
      onDelete={() => handleFolderAction(folder, 'delete')}
      onRename={() => handleFolderAction(folder, 'rename')}
      onColorChange={() => handleFolderAction(folder, 'customize')}
    />
  </motion.div>
);

export const FolderGrid = ({
  folders,
  allFolders,
  onFolderSelect,
  onCreateFolder,
  searchTerm,
  onClearSearch,
}: FolderGridProps): React.JSX.Element => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'rename' | 'customize'>('edit');

  const handleFolderAction = (
    folder: Folder,
    action: 'edit' | 'delete' | 'rename' | 'customize'
  ): void => {
    setSelectedFolder(folder);

    if (action === 'delete') {
      setDeleteModalOpen(true);
    } else {
      setModalMode(action);
      setSettingsModalOpen(true);
    }
  };

  const closeModals = (): void => {
    setSettingsModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedFolder(null);
  };

  if (folders.length === 0) {
    return renderEmptyState(allFolders, searchTerm, onCreateFolder, onClearSearch);
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <AnimatePresence mode="popLayout">
          {folders.map((folder, index) =>
            renderFolderCard(folder, index, onFolderSelect, handleFolderAction)
          )}
        </AnimatePresence>
      </motion.div>

      <FolderSettingsModal
        isOpen={settingsModalOpen}
        onClose={closeModals}
        folder={selectedFolder}
        mode={modalMode}
      />

      <DeleteFolderModal isOpen={deleteModalOpen} onClose={closeModals} folder={selectedFolder} />
    </>
  );
};
