'use client';

import React from 'react';

import { BrainIcon } from '@/app/shared/icons';

export const MemorizationHeader = (): React.JSX.Element => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
          <BrainIcon size={20} className="text-on-accent" />
        </div>
        <div className="min-w-0 -mt-1">
          <h1 className="text-lg font-bold text-foreground leading-tight">Memorization Plan</h1>
          <p className="text-xs text-muted -mt-0.5">Track your memorization progress</p>
        </div>
      </div>
    </div>
  );
};
