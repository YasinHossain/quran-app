'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import { DeleteFolderModal } from './DeleteFolderModal';
import { EmptyBookmarks } from './EmptyStates';
import { FolderCard } from './FolderCard';
import { FolderSettingsModal } from './FolderSettingsModal';

import type { Folder } from '@/types';

interface FolderGridProps {
  folders: Folder[];
  onFolderSelect: (folderId: string) => void;
}

type FolderAction = 'delete' | 'customize';

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
        onDelete={() => onAction(folder, 'delete')}
        onColorChange={() => onAction(folder, 'customize')}
      />
    </motion.div>
  );

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <AnimatePresence mode="popLayout">{folders.map(renderFolderItem)}</AnimatePresence>
    </motion.div>
  );
};

interface UseFolderModalsReturn {
  handleAction: (folder: Folder, action: FolderAction) => void;
  modals: React.JSX.Element;
}

const useFolderModals = (): UseFolderModalsReturn => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleAction = (folder: Folder, action: FolderAction): void => {
    setSelectedFolder(folder);
    if (action === 'delete') {
      setDeleteModalOpen(true);
      return;
    }
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
      />
      <DeleteFolderModal isOpen={deleteModalOpen} onClose={closeModals} folder={selectedFolder} />
    </>
  );

  return { handleAction, modals };
};

export const FolderGrid = ({ folders, onFolderSelect }: FolderGridProps): React.JSX.Element => {
  const { handleAction, modals } = useFolderModals();

  if (folders.length === 0) {
    return <EmptyBookmarks />;
  }

  return (
    <>
      <FolderCards folders={folders} onFolderSelect={onFolderSelect} onAction={handleAction} />
      {modals}
    </>
  );
};
