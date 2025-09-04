'use client';
import type React from 'react';

import { EnhancedFolderCard } from '@/app/shared/ui/cards/EnhancedFolderCard';
import { Folder } from '@/types';

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
}

export const FolderCard = React.memo(function FolderCard({
  folder,
  onClick,
  onEdit,
  onDelete,
  onRename,
  onColorChange,
}: FolderCardProps): JSX.Element {
  return (
    <EnhancedFolderCard
      folder={folder}
      onClick={onClick}
      onEdit={onEdit}
      onDelete={onDelete}
      onRename={onRename}
      onColorChange={onColorChange}
    />
  );
});
