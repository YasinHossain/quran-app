'use client';
import React, { memo } from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

import { Button } from './Button';

export const PANEL_MODAL_CENTER_CLASS = 'relative w-full max-w-md rounded-lg bg-surface shadow-xl';

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
      className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-40"
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
  if (!title && !showCloseButton) return null;
  return (
    <header className="flex items-center justify-between mb-4">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {showCloseButton && (
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
          <CloseIcon size={18} />
        </Button>
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
    <>
      <PanelOverlay onClose={onClose} closeOnOverlayClick={closeOnOverlayClick} />
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div
          className={cn('z-50 text-foreground p-6', PANEL_MODAL_CENTER_CLASS, className)}
          onPointerDown={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <PanelHeader
            {...(title !== undefined ? { title } : {})}
            showCloseButton={showCloseButton}
            onClose={onClose}
          />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
});
