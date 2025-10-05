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
      className="rounded-full p-1.5 text-muted hover:bg-surface-hover hover:text-accent transition-colors"
      aria-label="Close"
    >
      <CloseIcon size={20} />
    </button>
  </div>
);
