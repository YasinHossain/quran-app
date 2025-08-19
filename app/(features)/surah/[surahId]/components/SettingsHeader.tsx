'use client';

import React from 'react';
import { ArrowLeftIcon } from '@/app/shared/icons';

interface SettingsHeaderProps {
  onClose: () => void;
}

export const SettingsHeader = ({ onClose }: SettingsHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      <button
        aria-label="Back"
        onClick={onClose}
        className="p-2 rounded-full hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
      >
        <ArrowLeftIcon size={18} />
      </button>
      <h2 className="flex-grow text-center text-lg font-bold">Settings</h2>
      <div className="w-8" />
    </header>
  );
};
