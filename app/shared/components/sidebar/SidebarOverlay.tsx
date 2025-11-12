'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  position: 'left' | 'right';
  showOverlay: boolean;
}

export const SidebarOverlay = ({
  isOpen,
  onClose,
  position,
  showOverlay,
}: SidebarOverlayProps): React.JSX.Element | null => {
  if (!showOverlay || !isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden z-40'
      )}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="button"
      tabIndex={-1}
      aria-label="Close sidebar"
    />
  );
};
