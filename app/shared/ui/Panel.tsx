'use client';

import React, { memo } from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

import { Button } from './Button';

export const PANEL_VARIANTS = {
  sidebar: 'fixed top-0 bottom-0 right-0 w-80 bg-surface shadow-lg pt-safe pb-safe',
  modal: 'fixed inset-4 bg-surface rounded-lg shadow-xl max-w-2xl max-h-96 mx-auto my-auto',
  'modal-center': 'relative w-full max-w-md rounded-lg bg-surface shadow-xl',
  'bottom-sheet':
    'fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl max-h-[90dvh] pb-safe',
  overlay: 'fixed top-16 right-4 w-72 bg-surface rounded-lg shadow-lg border border-border',
  fullscreen: 'fixed inset-0 bg-surface pt-safe pb-safe',
} as const;

export interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: keyof typeof PANEL_VARIANTS | string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

interface PanelOverlayProps {
  onClose: () => void;
  closeOnOverlayClick: boolean;
  variant: 'modal-center' | 'standard';
}

const PanelOverlay = memo(function PanelOverlay({
  onClose,
  closeOnOverlayClick,
  variant,
}: PanelOverlayProps): React.JSX.Element {
  const handleOverlayInteraction = closeOnOverlayClick ? onClose : undefined;
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (closeOnOverlayClick && (e.key === 'Escape' || e.key === 'Enter')) {
      onClose();
    }
  };

  const overlayClass =
    variant === 'modal-center'
      ? 'fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-40 flex items-center justify-center'
      : 'fixed inset-0 bg-background/80 backdrop-blur-sm z-40';

  return (
    <div
      className={overlayClass}
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
  variant: 'modal-center' | 'standard';
}

const PanelHeader = memo(function PanelHeader({
  title,
  showCloseButton,
  onClose,
  variant,
}: PanelHeaderProps): React.JSX.Element | null {
  if (!title && !showCloseButton) return null;

  const headerClass =
    variant === 'modal-center'
      ? 'flex items-center justify-between mb-4'
      : 'flex items-center justify-between p-4 border-b border-border';

  return (
    <header className={headerClass}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {showCloseButton && (
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
          <CloseIcon size={18} />
        </Button>
      )}
    </header>
  );
});

interface ModalCenterPanelProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
  variantClass: string;
}

const ModalCenterPanel = memo(function ModalCenterPanel({
  onClose,
  title,
  children,
  className,
  showCloseButton,
  closeOnOverlayClick,
  variantClass,
}: ModalCenterPanelProps): React.JSX.Element {
  return (
    <>
      <PanelOverlay
        onClose={onClose}
        closeOnOverlayClick={closeOnOverlayClick}
        variant="modal-center"
      />
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div
          className={cn('z-50 text-foreground p-6', variantClass, className)}
          onPointerDown={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <PanelHeader
            title={title}
            showCloseButton={showCloseButton}
            onClose={onClose}
            variant="modal-center"
          />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
});

interface StandardPanelProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
  variantClass: string;
  isOpen: boolean;
  showOverlay: boolean;
}

const StandardPanel = memo(function StandardPanel({
  onClose,
  title,
  children,
  className,
  showCloseButton,
  closeOnOverlayClick,
  variantClass,
  isOpen,
  showOverlay,
}: StandardPanelProps): React.JSX.Element {
  return (
    <>
      {showOverlay && (
        <PanelOverlay
          onClose={onClose}
          closeOnOverlayClick={closeOnOverlayClick}
          variant="standard"
        />
      )}
      <div
        className={cn(
          'z-50 text-foreground transition-transform duration-300',
          variantClass,
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        <PanelHeader
          title={title}
          showCloseButton={showCloseButton}
          onClose={onClose}
          variant="standard"
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
});

export const Panel = memo(function Panel({
  isOpen,
  onClose,
  variant = 'sidebar',
  title,
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: PanelProps): React.JSX.Element {
  if (!isOpen) return null;

  const variantClass =
    variant in PANEL_VARIANTS ? PANEL_VARIANTS[variant as keyof typeof PANEL_VARIANTS] : variant;

  const showOverlay =
    variant === 'sidebar' ||
    variant === 'modal' ||
    variant === 'modal-center' ||
    variant === 'bottom-sheet' ||
    variant === 'fullscreen';

  if (variant === 'modal-center') {
    return (
      <ModalCenterPanel
        onClose={onClose}
        title={title}
        className={className}
        showCloseButton={showCloseButton}
        closeOnOverlayClick={closeOnOverlayClick}
        variantClass={variantClass}
      >
        {children}
      </ModalCenterPanel>
    );
  }

  return (
    <StandardPanel
      onClose={onClose}
      title={title}
      className={className}
      showCloseButton={showCloseButton}
      closeOnOverlayClick={closeOnOverlayClick}
      variantClass={variantClass}
      isOpen={isOpen}
      showOverlay={showOverlay}
    >
      {children}
    </StandardPanel>
  );
});
