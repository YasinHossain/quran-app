'use client';

import type React from 'react';
import { BookmarkIcon } from '@/app/shared/icons';

export const BookmarksPageHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
          <BookmarkIcon size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">Bookmarks</h1>
          <p className="text-xs text-muted">Organize your verses</p>
        </div>
      </div>
    </div>
  );
};
