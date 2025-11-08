'use client';

import React from 'react';

import { FolderIcon } from '@/app/shared/icons';
import { Folder } from '@/types';

interface FolderPreviewProps {
  folder: Folder;
}

export const FolderPreview = ({ folder }: FolderPreviewProps): React.JSX.Element => (
  <div className="bg-surface-hover rounded-xl p-4 mb-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
        <FolderIcon size={20} className="text-accent" aria-hidden="true" />
      </div>
      <div>
        <div className="font-semibold text-foreground">{folder.name}</div>
        <div className="text-sm text-muted">
          {folder.bookmarks.length} verse{folder.bookmarks.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  </div>
);
