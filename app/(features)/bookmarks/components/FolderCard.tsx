'use client';

import React from 'react';

import { EnhancedFolderCard } from '@/app/shared/ui/cards/EnhancedFolderCard';
import { Folder } from '@/types';

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
}

export const FolderCard = React.memo(function FolderCard({
  folder,
  onClick,
  onDelete,
  onRename,
  onColorChange,
}: FolderCardProps): React.JSX.Element {
  return (
    <EnhancedFolderCard
      folder={folder}
      onClick={onClick}
      onDelete={onDelete}
      onRename={onRename}
      onColorChange={onColorChange}
    />
  );
});
