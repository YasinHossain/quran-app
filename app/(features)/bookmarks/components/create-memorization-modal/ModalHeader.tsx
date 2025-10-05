'use client';

import React from 'react';

import { BrainIcon } from '@/app/shared/icons';

export const ModalHeader = (): React.JSX.Element => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
      <BrainIcon size={24} className="text-accent" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-foreground">Memorization Planner</h2>
      <p className="text-sm text-muted mt-1">Create a new memorization plan</p>
    </div>
  </div>
);
