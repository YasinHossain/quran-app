'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect, useCallback, useId } from 'react';

import { EllipsisHIcon, SlidersIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
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
  menuId: string;
}

const FolderMenuPanel = ({
  menuRef,
  onDelete,
  onColorChange,
  onClose,
  menuId,
}: FolderMenuPanelProps): React.JSX.Element => (
  <motion.div
    id={menuId}
    ref={menuRef}
    role="menu"
    aria-label="Folder options"
    initial={{ opacity: 0, scale: 0.95, y: -5 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -5 }}
    transition={{ duration: 0.15 }}
    className="absolute right-0 top-full mt-2 min-w-[11rem] rounded-xl border border-border/40 bg-surface/90 backdrop-blur-md shadow-lg z-[200] py-2"
    onClick={(event): void => {
      event.stopPropagation();
    }}
  >
    {onColorChange ? (
      <button
        type="button"
        role="menuitem"
        onClick={(event): void => {
          event.stopPropagation();
          onColorChange();
          onClose();
        }}
        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors"
      >
        <SlidersIcon size={18} className="text-muted" aria-hidden="true" />
        <span>Edit Folder</span>
      </button>
    ) : null}
    {onColorChange ? <div className="my-1 h-px bg-border/40" /> : null}
    <DeleteItem onDelete={onDelete} closeMenu={onClose} />
  </motion.div>
);

export const FolderContextMenu = ({
  onDelete,
  onColorChange,
}: FolderContextMenuProps): React.JSX.Element => {
  const { isOpen, menuRef, buttonRef, handleToggleMenu, handleCloseMenu } = useContextMenu();
  const menuId = useId();

  return (
    <div className={cn('relative', isOpen && 'z-[200]')}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          'p-1.5 rounded-full text-muted hover:text-accent hover:bg-interactive transition-colors duration-200',
          touchClasses.target,
          touchClasses.gesture,
          touchClasses.focus
        )}
        onClick={handleToggleMenu}
        aria-label="Folder options"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={isOpen ? menuId : undefined}
      >
        <EllipsisHIcon size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <FolderMenuPanel
            menuId={menuId}
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
