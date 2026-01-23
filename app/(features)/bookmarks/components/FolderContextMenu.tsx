'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { useTranslation } from 'react-i18next';

import { EllipsisHIcon, SlidersIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import { DeleteItem } from './DeleteItem';

// Duration for exit animation (matches CSS)
const EXIT_ANIMATION_MS = 150;

interface UseContextMenuResult {
  isOpen: boolean;
  shouldRender: boolean;
  isExiting: boolean;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
  handleToggleMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleCloseMenu: () => void;
}

const useContextMenu = (): UseContextMenuResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCloseMenu = useCallback((): void => {
    if (shouldRender && !isExiting) {
      setIsExiting(true);
      setIsOpen(false);
      setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, EXIT_ANIMATION_MS);
    }
  }, [shouldRender, isExiting]);

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

  const handleToggleMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      if (isOpen) {
        handleCloseMenu();
      } else {
        setShouldRender(true);
        setIsOpen(true);
        setIsExiting(false);
      }
    },
    [isOpen, handleCloseMenu]
  );

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
    shouldRender,
    isExiting,
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
  isExiting: boolean;
}

const FolderMenuPanel = ({
  menuRef,
  onDelete,
  onColorChange,
  onClose,
  menuId,
  isExiting,
}: FolderMenuPanelProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      id={menuId}
      ref={menuRef}
      role="menu"
      aria-label={t('folder_options')}
      tabIndex={-1}
      className={cn(
        'absolute right-0 top-full mt-2 min-w-[11rem] rounded-xl border border-border/40 bg-surface shadow-lg z-[200] py-2 transform-gpu',
        isExiting ? 'animate-menu-out' : 'animate-menu-in'
      )}
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
          <span>{t('edit_folder')}</span>
        </button>
      ) : null}
      {onColorChange ? <div className="my-1 h-px bg-border/40" /> : null}
      <DeleteItem onDelete={onDelete} closeMenu={onClose} />
    </div>
  );
};

export const FolderContextMenu = ({
  onDelete,
  onColorChange,
}: FolderContextMenuProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { isOpen, shouldRender, isExiting, menuRef, buttonRef, handleToggleMenu, handleCloseMenu } =
    useContextMenu();
  const menuId = useId();

  return (
    <div className={cn('relative', isOpen && 'z-[200]')}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          'p-1.5 rounded-full text-muted hover:text-accent hover:bg-interactive-hover transition-colors duration-200 flex items-center justify-center',
          touchClasses.gesture,
          touchClasses.focus
        )}
        onClick={handleToggleMenu}
        aria-label={t('folder_options')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={isOpen ? menuId : undefined}
      >
        <EllipsisHIcon size={18} />
      </button>

      {shouldRender && (
        <FolderMenuPanel
          menuId={menuId}
          menuRef={menuRef}
          onDelete={onDelete}
          onClose={handleCloseMenu}
          isExiting={isExiting}
          {...(onColorChange ? { onColorChange } : {})}
        />
      )}
    </div>
  );
};
