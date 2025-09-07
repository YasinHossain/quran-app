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

type FolderAction = 'edit' | 'delete' | 'rename' | 'customize';

interface FolderCardsProps {
  folders: Folder[];
  onFolderSelect: (id: string) => void;
  onAction: (folder: Folder, action: FolderAction) => void;
}

const FolderCards = ({
  folders,
  onFolderSelect,
  onAction,
}: FolderCardsProps): React.JSX.Element => {
  const renderFolderItem = (folder: Folder, index: number): React.JSX.Element => (
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
        onEdit={() => onAction(folder, 'edit')}
        onDelete={() => onAction(folder, 'delete')}
        onRename={() => onAction(folder, 'rename')}
        onColorChange={() => onAction(folder, 'customize')}
      />
    </motion.div>
  );

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <AnimatePresence mode="popLayout">
        {folders.map(renderFolderItem)}
      </AnimatePresence>
    </motion.div>
  );
};

const useFolderModals = () => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'rename' | 'customize'>('edit');

  const handleAction = (folder: Folder, action: FolderAction): void => {
    setSelectedFolder(folder);
    if (action === 'delete') {
      setDeleteModalOpen(true);
      return;
    }
    setModalMode(action);
    setSettingsModalOpen(true);
  };

  const closeModals = (): void => {
    setSettingsModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedFolder(null);
  };

  const modals = (
    <>
      <FolderSettingsModal
        isOpen={settingsModalOpen}
        onClose={closeModals}
        folder={selectedFolder}
        mode={modalMode}
      />
      <DeleteFolderModal
        isOpen={deleteModalOpen}
        onClose={closeModals}
        folder={selectedFolder}
      />
    </>
  );

  return { handleAction, modals };
};

export const FolderGrid = ({
  folders,
  allFolders,
  onFolderSelect,
  onCreateFolder,
  searchTerm,
  onClearSearch,
}: FolderGridProps): React.JSX.Element => {
  const { handleAction, modals } = useFolderModals();

  if (folders.length === 0) {
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
  }

  return (
    <>
      <FolderCards
        folders={folders}
        onFolderSelect={onFolderSelect}
        onAction={handleAction}
      />
      {modals}
    </>
  );
};
