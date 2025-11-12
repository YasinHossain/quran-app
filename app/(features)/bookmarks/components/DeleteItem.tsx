import React from 'react';

import { AlertIcon } from '@/app/shared/icons';

interface DeleteItemProps {
  onDelete: () => void;
  closeMenu: () => void;
}

export const DeleteItem = ({ onDelete, closeMenu }: DeleteItemProps): React.JSX.Element => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onDelete();
    closeMenu();
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-error hover:bg-surface-hover transition-colors"
    >
      <AlertIcon size={18} className="text-error" aria-hidden="true" />
      <span>Delete Folder</span>
    </button>
  );
};
