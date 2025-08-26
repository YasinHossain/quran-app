'use client';

import React from 'react';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarOverlay = ({ isOpen, onClose }: SidebarOverlayProps) => (
  <div
    className={`fixed inset-0 bg-transparent z-30 lg:hidden ${isOpen ? '' : 'hidden'}`}
    role="button"
    tabIndex={0}
    onClick={onClose}
    onKeyDown={(e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onClose();
      }
    }}
  />
);
