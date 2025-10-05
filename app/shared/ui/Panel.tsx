'use client';
import React, { memo } from 'react';

import { cn } from '@/lib/utils/cn';

import { PanelHeader } from './PanelHeader';
import { PanelOverlay } from './PanelOverlay';

export const PANEL_VARIANTS = {
  sidebar: 'fixed top-0 bottom-0 right-0 w-80 bg-surface shadow-lg pt-safe pb-safe',
  modal: 'fixed inset-4 bg-surface rounded-lg shadow-xl max-w-2xl max-h-96 mx-auto my-auto',
  'bottom-sheet':
    'fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl max-h-[90dvh] pb-safe',
  overlay: 'fixed top-16 right-4 w-72 bg-surface rounded-lg shadow-lg border border-border',
  fullscreen: 'fixed inset-0 bg-surface pt-safe pb-safe',
} as const;

const OVERLAY_VARIANTS = new Set([
  'sidebar',
  'modal',
  'modal-center',
  'bottom-sheet',
  'fullscreen',
]);

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

// PanelOverlay and PanelHeader extracted to reduce file size

interface RenderArgs {
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

function renderModalCenter({
  onClose,
  title,
  children,
  className,
  showCloseButton,
  closeOnOverlayClick,
  variantClass,
}: RenderArgs): React.JSX.Element {
  return (
    <>
      <PanelOverlay onClose={onClose} closeOnOverlayClick={closeOnOverlayClick} />
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div
          className={cn('z-50 text-foreground p-6', variantClass, className)}
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
}

function renderStandardPanel({
  onClose,
  title,
  children,
  className,
  showCloseButton,
  closeOnOverlayClick,
  variantClass,
  isOpen,
  showOverlay,
}: RenderArgs): React.JSX.Element {
  return (
    <>
      {showOverlay && <PanelOverlay onClose={onClose} closeOnOverlayClick={closeOnOverlayClick} />}
      <div
        className={cn(
          'z-50 text-foreground transition-transform duration-300',
          variantClass,
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        <PanelHeader
          {...(title !== undefined ? { title } : {})}
          showCloseButton={showCloseButton}
          onClose={onClose}
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}

const RENDERERS: Record<string, (args: RenderArgs) => React.JSX.Element> = {
  'modal-center': renderModalCenter,
};

export const Panel = memo(function Panel({
  isOpen,
  onClose,
  variant = 'sidebar',
  title,
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: PanelProps): React.JSX.Element | null {
  if (!isOpen) return null;
  const variantClass =
    variant in PANEL_VARIANTS ? PANEL_VARIANTS[variant as keyof typeof PANEL_VARIANTS] : variant;

  const showOverlay = OVERLAY_VARIANTS.has(variant);

  const renderer = RENDERERS[variant] ?? renderStandardPanel;

  return renderer({
    onClose,
    ...(title !== undefined ? { title } : {}),
    children,
    ...(className !== undefined ? { className } : {}),
    showCloseButton,
    closeOnOverlayClick,
    variantClass,
    isOpen,
    showOverlay,
  });
});
