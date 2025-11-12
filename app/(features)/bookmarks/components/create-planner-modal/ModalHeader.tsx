'use client';

import React from 'react';

import { CalendarIcon } from '@/app/shared/icons';

export const ModalHeader = (): React.JSX.Element => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
      <CalendarIcon size={24} className="text-accent" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-foreground">Planner</h2>
      <p className="text-sm text-muted mt-1">Create a new plan</p>
    </div>
  </div>
);
