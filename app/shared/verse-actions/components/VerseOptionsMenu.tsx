'use client';

import { memo, useState, useCallback, useRef, useEffect } from 'react';

import { CalendarIcon, EllipsisHIcon, ShareIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface VerseOptionsMenuProps {
  onShare: () => void;
  onAddToPlan?: () => void;
  className?: string;
}

export const VerseOptionsMenu = memo(function VerseOptionsMenu({
  onShare,
  onAddToPlan,
  className = '',
}: VerseOptionsMenuProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeMenu]);

  const handleShareClick = useCallback((): void => {
    onShare();
    closeMenu();
  }, [onShare, closeMenu]);

  const handleAddToPlanClick = useCallback((): void => {
    if (onAddToPlan) onAddToPlan();
    closeMenu();
  }, [onAddToPlan, closeMenu]);

  return (
    <div className={cn('relative z-modal', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Open verse options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleMenu}
        className={cn(
          'p-1.5 rounded-full hover:bg-interactive transition-colors text-muted hover:text-accent',
          touchClasses.focus
        )}
      >
        <EllipsisHIcon size={18} />
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Verse options"
          className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-surface shadow-modal z-modal py-2"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleShareClick}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors"
          >
            <ShareIcon size={18} className="text-muted" />
            <span>Share</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleAddToPlanClick}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors"
          >
            <CalendarIcon size={18} className="text-muted" />
            <span>Add to Plan</span>
          </button>
        </div>
      ) : null}
    </div>
  );
});
