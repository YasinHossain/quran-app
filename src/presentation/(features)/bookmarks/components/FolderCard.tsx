'use client';

import React from 'react';
import { EnhancedFolderCard } from '@/presentation/shared/ui/cards/EnhancedFolderCard';
import { Folder } from '@/types';

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = React.memo(function FolderCard({
  folder,
  onClick,
  onEdit,
  onDelete,
  onRename,
  onColorChange,
}) {
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
