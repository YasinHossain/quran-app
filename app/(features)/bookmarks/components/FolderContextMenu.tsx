'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { EllipsisHIcon, CloseIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

import { DeleteItem } from './DeleteItem';

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
  onDelete: () => void;
  onColorChange?: () => void;
}

interface FolderMenuPanelProps extends FolderContextMenuProps {
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  onClose: () => void;
}

const FolderMenuPanel = ({
  menuRef,
  onDelete,
  onColorChange,
  onClose,
}: FolderMenuPanelProps): React.JSX.Element => (
  <motion.div
    ref={menuRef}
    initial={{ opacity: 0, scale: 0.95, y: -5 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -5 }}
    transition={{ duration: 0.15 }}
    className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-lg shadow-modal z-50 py-2"
    onClick={(event): void => {
      event.stopPropagation();
    }}
  >
    {onColorChange ? (
      <button
        onClick={(event): void => {
          event.stopPropagation();
          onColorChange();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-surface-hover transition-colors"
      >
        Edit Folder
      </button>
    ) : null}
    {onColorChange ? <div className="my-1 h-px bg-border/50" /> : null}
    <DeleteItem onDelete={onDelete} closeMenu={onClose} />
  </motion.div>
);

export const FolderContextMenu = ({
  onDelete,
  onColorChange,
}: FolderContextMenuProps): React.JSX.Element => {
  const { isOpen, menuRef, buttonRef, handleToggleMenu, handleCloseMenu } = useContextMenu();

  return (
    <div className={cn('relative', isOpen && 'z-[80]')}>
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
          <FolderMenuPanel
            menuRef={menuRef}
            onDelete={onDelete}
            onClose={handleCloseMenu}
            {...(onColorChange ? { onColorChange } : {})}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
