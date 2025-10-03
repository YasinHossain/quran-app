'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { EllipsisHIcon, CloseIcon } from '@/app/shared/icons';

import { DeleteItem } from './DeleteItem';
import { RenameItem } from './RenameItem';

interface UseContextMenuResult {
  isOpen: boolean;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
  handleToggleMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleCloseMenu: () => void;
}

const useContextMenu = (): UseContextMenuResult => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCloseMenu = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent): void => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleCloseMenu();
      }
    },
    [handleCloseMenu]
  );

  const handleToggleMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return {
    isOpen,
    menuRef,
    buttonRef,
    handleToggleMenu,
    handleCloseMenu,
  };
};

interface FolderContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const FolderContextMenu = ({
  onEdit,
  onDelete,
}: FolderContextMenuProps): React.JSX.Element => {
  const { isOpen, menuRef, buttonRef, handleToggleMenu, handleCloseMenu } = useContextMenu();

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="rounded-full p-1.5 text-muted hover:bg-surface-hover hover:text-accent transition-all duration-200 touch-manipulation"
        onClick={handleToggleMenu}
        aria-label="Folder options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isOpen ? <CloseIcon size={16} /> : <EllipsisHIcon size={16} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-lg shadow-modal z-50 py-2"
          >
            <RenameItem onRename={onEdit} closeMenu={handleCloseMenu} />
            <DeleteItem onDelete={onDelete} closeMenu={handleCloseMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
