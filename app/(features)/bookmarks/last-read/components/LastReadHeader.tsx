'use client';

import React from 'react';

import { ClockIcon } from '@/app/shared/icons';

export const LastReadHeader = (): React.JSX.Element => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
          <ClockIcon size={20} className="text-on-accent" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">Recent</h1>
          <p className="text-xs text-muted">Last visited</p>
        </div>
      </div>
    </div>
  );
};
