'use client';

import * as Popover from '@radix-ui/react-popover';
import React, { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';

import { EllipsisHIcon, SlidersIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import { DeleteItem } from './DeleteItem';

interface FolderContextMenuProps {
  onDelete: () => void;
  onColorChange?: () => void;
}

export const FolderContextMenu = ({
  onDelete,
  onColorChange,
}: FolderContextMenuProps): React.JSX.Element => {
  const { t } = useTranslation();
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'p-1.5 rounded-full text-muted hover:text-accent hover:bg-interactive-hover transition-colors duration-200 flex items-center justify-center',
            touchClasses.gesture,
            touchClasses.focus
          )}
          aria-label={t('folder_options')}
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisHIcon size={18} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          id={menuId}
          side="bottom"
          align="end"
          sideOffset={8}
          className={cn(
            'min-w-[11rem] rounded-xl bg-surface-navigation shadow-lg z-[200] py-2 overflow-hidden outline-none',
            'data-[state=open]:animate-menu-in',
            'data-[state=closed]:animate-menu-out'
          )}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {onColorChange ? (
            <button
              type="button"
              role="menuitem"
              onClick={(event): void => {
                event.stopPropagation();
                onColorChange();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-interactive-hover transition-colors"
            >
              <SlidersIcon size={18} className="text-muted" aria-hidden="true" />
              <span>{t('edit_folder')}</span>
            </button>
          ) : null}
          {onColorChange ? <div className="my-1" aria-hidden="true" /> : null}
          <DeleteItem onDelete={onDelete} closeMenu={() => setIsOpen(false)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
