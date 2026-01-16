'use client';
import React, { memo } from 'react';

import { Portal } from '@/app/shared/components/Portal';
import { CloseIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

export const PANEL_MODAL_CENTER_CLASS =
  'relative w-full max-w-md rounded-lg bg-surface shadow-xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden';

export interface PanelModalCenterProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

interface PanelOverlayProps {
  onClose: () => void;
  closeOnOverlayClick: boolean;
}

const PanelOverlay = memo(function PanelOverlay({
  onClose,
  closeOnOverlayClick,
}: PanelOverlayProps): React.JSX.Element {
  const handleOverlayInteraction = closeOnOverlayClick ? onClose : undefined;
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (closeOnOverlayClick && (e.key === 'Escape' || e.key === 'Enter')) onClose();
  };
  return (
    <div
      className="fixed inset-0 bg-background/85 z-[900]"
      onClick={handleOverlayInteraction}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={closeOnOverlayClick ? 0 : -1}
      aria-label="Close panel"
    />
  );
});

interface PanelHeaderProps {
  title?: string;
  showCloseButton: boolean;
  onClose: () => void;
}

const PanelHeader = memo(function PanelHeader({
  title,
  showCloseButton,
  onClose,
}: PanelHeaderProps): React.JSX.Element | null {
  const hasTitle = Boolean(title);
  if (!hasTitle && !showCloseButton) return null;

  return (
    <header className={cn('flex items-center mb-4', hasTitle ? 'justify-between' : 'justify-end')}>
      {hasTitle && <h2 className="text-lg font-semibold">{title}</h2>}
      {showCloseButton && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-interactive-hover transition-colors flex items-center justify-center"
          aria-label="Close panel"
        >
          <CloseIcon size={18} />
        </button>
      )}
    </header>
  );
});

export const PanelModalCenter = memo(function PanelModalCenter({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: PanelModalCenterProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <Portal>
      <>
        <PanelOverlay onClose={onClose} closeOnOverlayClick={closeOnOverlayClick} />
        <div className="fixed inset-0 z-[905] flex items-center justify-center p-3 sm:p-4 pt-safe pb-safe">
          <div
            className={cn(
              'z-[910] text-foreground p-6 flex flex-col',
              PANEL_MODAL_CENTER_CLASS,
              className
            )}
            onPointerDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <PanelHeader
              {...(title !== undefined ? { title } : {})}
              showCloseButton={showCloseButton}
              onClose={onClose}
            />
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </div>
        </div>
      </>
    </Portal>
  );
});
