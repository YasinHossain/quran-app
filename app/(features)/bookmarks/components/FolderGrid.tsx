'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderCard } from './FolderCard';
import { FolderSettingsModal } from './FolderSettingsModal';
import { DeleteFolderModal } from './DeleteFolderModal';
import { EmptyBookmarks, EmptySearch } from './EmptyStates';
import type { Folder } from '@/types';

interface FolderGridProps {
  folders: Folder[];
  allFolders: Folder[];
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
  searchTerm: string;
  onClearSearch: () => void;
}

export const FolderGrid = ({
  folders,
  allFolders,
  onFolderSelect,
  onCreateFolder,
  searchTerm,
  onClearSearch,
}: FolderGridProps): JSX.Element => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'rename' | 'customize'>('edit');

  const handleFolderAction = (
    folder: Folder,
    action: 'edit' | 'delete' | 'rename' | 'customize'
  ) => {
    setSelectedFolder(folder);

    switch (action) {
      case 'delete':
        setDeleteModalOpen(true);
        break;
      case 'edit':
      case 'rename':
      case 'customize':
        setModalMode(action);
        setSettingsModalOpen(true);
        break;
    }
  };

  const closeModals = () => {
    setSettingsModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedFolder(null);
  };

  if (folders.length === 0) {
    // Show different empty states based on whether there are any folders and search state
    if (allFolders.length === 0) {
      // No folders at all - show onboarding
      return <EmptyBookmarks onCreateFolder={onCreateFolder} />;
    } else if (searchTerm) {
      // Has folders but search returned no results
      return <EmptySearch searchTerm={searchTerm} onClearSearch={onClearSearch} />;
    }
    // Fallback (shouldn't reach here normally)
    return (
      <div className="mt-10 text-center text-muted">
        <p>No folders found.</p>
      </div>
    );
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
          {folders.map((folder, index) => (
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
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
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
