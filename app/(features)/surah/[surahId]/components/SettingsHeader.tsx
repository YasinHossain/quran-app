'use client';

import React from 'react';
import { ArrowLeftIcon } from '@/app/shared/icons';

interface SettingsHeaderProps {
  onClose: () => void;
}

export const SettingsHeader = ({ onClose }: SettingsHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-3 py-1 h-12 min-h-12 border-b border-border bg-background">
      <button
        aria-label="Back"
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
      >
        <ArrowLeftIcon size={16} />
      </button>
      <h2 className="flex-grow text-center text-base font-semibold">Settings</h2>
      <div className="w-7" />
    </header>
  );
};
