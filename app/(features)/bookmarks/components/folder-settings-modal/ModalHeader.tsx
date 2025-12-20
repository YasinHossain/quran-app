'use client';

import React from 'react';

import { CloseIcon } from '@/app/shared/icons';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader = ({ title, onClose }: ModalHeaderProps): React.JSX.Element => (
  <div className="flex items-center justify-between mb-6">
    <h2 id="folder-settings-title" className="text-xl font-semibold text-foreground">
      {title}
    </h2>
    <button
      onClick={onClose}
      className="shrink-0 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-muted hover:text-foreground"
      aria-label="Close"
    >
      <CloseIcon size={18} />
    </button>
  </div>
);
