'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  position: 'left' | 'right';
  showOverlay: boolean;
  desktopBreakpoint?: 'lg' | 'xl' | '2xl';
}

export const SidebarOverlay = ({
  isOpen,
  onClose,
  position: _position,
  showOverlay,
  desktopBreakpoint = 'lg',
}: SidebarOverlayProps): React.JSX.Element | null => {
  void _position;
  if (!showOverlay || !isOpen) {
    return null;
  }

  const hiddenFromBreakpoint =
    desktopBreakpoint === 'xl'
      ? 'xl:hidden'
      : desktopBreakpoint === '2xl'
        ? '2xl:hidden'
        : 'lg:hidden';

  return (
    <div
      className={cn(
        'fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm transition-opacity duration-300 z-40',
        hiddenFromBreakpoint
      )}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="button"
      tabIndex={-1}
      aria-label="Dismiss sidebar overlay"
    />
  );
};
