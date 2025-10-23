'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { EmptyBookmarks } from './EmptyStates';
import { FolderCard } from './FolderCard';

import type { Folder } from '@/types';

interface FolderGridProps {
  folders: Folder[];
  onFolderSelect: (folderId: string) => void;
}

type FolderAction = 'delete' | 'customize';

interface FolderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  mode?: 'edit' | 'create';
}

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

const FolderSettingsModal = dynamic<FolderSettingsModalProps>(
  () =>
    import('./FolderSettingsModal').then((mod) => ({
      default: mod.FolderSettingsModal,
    })),
  { ssr: false }
);

const DeleteFolderModal = dynamic<DeleteFolderModalProps>(
  () =>
    import('./DeleteFolderModal').then((mod) => ({
      default: mod.DeleteFolderModal,
    })),
  { ssr: false }
);

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderFolderItem = (folder: Folder, index: number): React.JSX.Element => (
    <div
      key={folder.id}
      className={`transform transition-all duration-300 ease-out ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <FolderCard
        folder={folder}
        onClick={() => onFolderSelect(folder.id)}
        onDelete={() => onAction(folder, 'delete')}
        onColorChange={() => onAction(folder, 'customize')}
      />
    </div>
  );

  return (
    <div
      className={`grid grid-cols-1 gap-4 transition-opacity duration-300 ease-out sm:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8 ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {folders.map(renderFolderItem)}
    </div>
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
