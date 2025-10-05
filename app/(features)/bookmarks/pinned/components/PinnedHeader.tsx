'use client';

import React from 'react';

import { PinIcon } from '@/app/shared/icons';

export const PinnedHeader = (): React.JSX.Element => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
          <PinIcon size={20} className="text-on-accent" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">Pinned Verses</h1>
          <p className="text-xs text-muted">Quick access</p>
        </div>
      </div>
    </div>
  );
};
