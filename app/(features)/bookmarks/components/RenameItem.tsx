import React from 'react';

interface RenameItemProps {
  onRename: () => void;
  closeMenu: () => void;
}

export const RenameItem = ({ onRename, closeMenu }: RenameItemProps): React.JSX.Element => {
  const handleClick = (): void => {
    onRename();
    closeMenu();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-4 py-2 text-sm hover:bg-surface-hover transition-colors text-foreground"
    >
      Rename
    </button>
  );
};
