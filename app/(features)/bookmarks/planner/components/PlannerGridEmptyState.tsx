'use client';

import React from 'react';

import { CalendarIcon } from '@/app/shared/icons';

export const PlannerGridEmptyState = (): React.JSX.Element => (
  <div className="text-center py-16">
    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
      <CalendarIcon className="w-8 h-8 text-muted" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">Create Your First Plan</h3>
    <p className="text-muted max-w-md mx-auto">
      Tap the <span className="font-semibold text-foreground">+</span> button in the top-right
      corner to build a plan and track your memorization journey.
    </p>
  </div>
);
