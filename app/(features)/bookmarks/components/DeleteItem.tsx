import React from 'react';

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
      onClick={handleClick}
      className="w-full text-left px-4 py-2 text-sm hover:bg-surface-hover transition-colors text-error hover:text-error/90"
    >
      Delete
    </button>
  );
};
