'use client';

import React from 'react';

import { CloseIcon } from '@/app/shared/icons';

interface ModalHeaderProps {
  onClose: () => void;
}

export const ModalHeader = ({ onClose }: ModalHeaderProps): React.JSX.Element => (
  <div className="flex items-center justify-between p-6 pb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
        <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">Delete Folder</h2>
        <p className="text-sm text-muted">This action cannot be undone</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="rounded-xl p-2 text-muted hover:bg-surface-hover hover:text-accent transition-all duration-200"
      aria-label="Close"
    >
      <CloseIcon size={20} />
    </button>
  </div>
);
