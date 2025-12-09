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
      className="shrink-0 rounded-full p-2.5 text-muted hover:bg-interactive-hover hover:text-error transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent/40 focus:outline-none"
      aria-label="Close"
    >
      <CloseIcon size={20} />
    </button>
  </div>
);
