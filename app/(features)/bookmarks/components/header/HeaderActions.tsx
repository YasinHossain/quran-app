'use client';

import React from 'react';

import { PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

export interface HeaderActionsProps {
  onNewFolderClick: () => void;
}

export const HeaderActions = ({ onNewFolderClick }: HeaderActionsProps): React.JSX.Element => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <Button
      onClick={onNewFolderClick}
      variant="primary"
      size="sm"
      className="flex items-center gap-2 px-4 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
    >
      <PlusIcon size={16} />
      <span>New Folder</span>
    </Button>
  </div>
);
