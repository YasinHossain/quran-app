'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { CloseIcon } from '@/app/shared/icons';
import { Button } from './Button';

export const PANEL_VARIANTS = {
  sidebar: 'fixed top-0 bottom-0 right-0 w-80 bg-surface shadow-lg pt-safe pb-safe',
  modal: 'fixed inset-4 bg-surface rounded-lg shadow-xl max-w-2xl max-h-96 mx-auto my-auto',
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

export const Panel: React.FC<PanelProps> = ({
  isOpen,
  onClose,
  variant = 'sidebar',
  title,
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const variantClass =
    variant in PANEL_VARIANTS ? PANEL_VARIANTS[variant as keyof typeof PANEL_VARIANTS] : variant;

  const showOverlay = variant === 'sidebar' || variant === 'modal' || variant === 'fullscreen';

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={closeOnOverlayClick ? onClose : undefined}
          onKeyDown={(e) => {
            if (closeOnOverlayClick && (e.key === 'Escape' || e.key === 'Enter')) {
              onClose();
            }
          }}
          role="button"
          tabIndex={closeOnOverlayClick ? 0 : -1}
          aria-label="Close panel"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'z-50 text-foreground transition-transform duration-300',
          variantClass,
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <header className="flex items-center justify-between p-4 border-b border-border">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {showCloseButton && (
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
                <CloseIcon size={18} />
              </Button>
            )}
          </header>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
};
