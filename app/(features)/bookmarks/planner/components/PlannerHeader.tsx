'use client';

import React from 'react';

import { CalendarIcon, PlusIcon } from '@/app/shared/icons';

interface PlannerHeaderProps {
  onCreatePlan: () => void;
}

export const PlannerHeader = ({ onCreatePlan }: PlannerHeaderProps): React.JSX.Element => {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
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
          aria-label="Create Plan"
          onClick={onCreatePlan}
          className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation select-none min-h-touch"
        >
          <PlusIcon size={20} />
          <span className="sr-only">Create Plan</span>
        </button>
      </div>
    </div>
  );
};
