'use client';

import React from 'react';

import { FolderIcon } from '@/app/shared/icons';

interface FolderInputProps {
  folderName: string;
  onFolderNameChange: (name: string) => void;
}

export const FolderInput = ({
  folderName,
  onFolderNameChange,
}: FolderInputProps): React.JSX.Element => (
  <div className="space-y-2">
    <label htmlFor="folder-name" className="block text-sm font-semibold text-foreground">
      Folder Name
    </label>
    <div className="relative">
      <input
        id="folder-name"
        type="text"
        value={folderName}
        onChange={(e) => onFolderNameChange(e.target.value)}
        placeholder="e.g., Daily Reading, Memorization, Reflection"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
        maxLength={50}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">
        {folderName.length}/50
      </div>
    </div>
    {folderName.length > 0 && (
      <div className="flex items-center gap-2 text-xs text-muted">
        <FolderIcon size={14} />
        <span>Preview: {folderName.trim()}</span>
      </div>
    )}
  </div>
);
