'use client';

import React from 'react';

import { CalendarIcon, PlusIcon } from '@/app/shared/icons';

interface PlannerHeaderProps {
  onCreatePlan: () => void;
}

export const PlannerHeader = ({
  onCreatePlan,
}: PlannerHeaderProps): React.JSX.Element => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
          <CalendarIcon size={20} className="text-on-accent" />
        </div>
        <div className="min-w-0 -mt-1">
          <h1 className="text-lg font-bold text-foreground leading-tight">Planner</h1>
          <p className="text-xs text-muted -mt-0.5">Curate plans for your memorization journey</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCreatePlan}
        className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-accent px-4 py-2 font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <PlusIcon size={18} />
        Create Plan
      </button>
    </div>
  );
};
