'use client';

import React from 'react';

interface PlanNameInputProps {
  planName: string;
  onChange: (planName: string) => void;
}

export const PlanNameInput = ({ planName, onChange }: PlanNameInputProps): React.JSX.Element => (
  <div className="space-y-2">
    <label htmlFor="plan-name" className="block text-sm font-semibold text-foreground">
      Set Plan Name
    </label>
    <div className="relative">
      <input
        id="plan-name"
        type="text"
        value={planName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Plan Name"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
        maxLength={50}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">
        {planName.length}/50
      </div>
    </div>
  </div>
);

