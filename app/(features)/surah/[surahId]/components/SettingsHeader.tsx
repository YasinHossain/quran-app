'use client';

import React from 'react';
import { ArrowLeftIcon } from '@/app/shared/icons';

interface SettingsHeaderProps {
  onClose: () => void;
}

export const SettingsHeader = ({ onClose }: SettingsHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2 h-12 min-h-12 border-b border-border bg-background">
      <button
        aria-label="Close settings"
        onClick={onClose}
        className="btn-touch p-2 rounded-full hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
      >
        <ArrowLeftIcon size={18} className="sm:w-4 sm:h-4" />
      </button>
      <h2 className="flex-grow text-center text-mobile-lg font-semibold text-foreground">
        Settings
      </h2>
      <div className="w-10 lg:hidden" />
    </header>
  );
};
