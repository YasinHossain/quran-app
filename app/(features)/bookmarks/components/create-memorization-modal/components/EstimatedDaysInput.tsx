'use client';

import React from 'react';

interface EstimatedDaysInputProps {
  estimatedDays: number;
  onChange: (days: number) => void;
}

export const EstimatedDaysInput = ({
  estimatedDays,
  onChange,
}: EstimatedDaysInputProps): React.JSX.Element => (
  <div className="space-y-2">
    <label htmlFor="estimated-days" className="block text-sm font-semibold text-foreground">
      Estimated Days
    </label>
    <input
      id="estimated-days"
      type="number"
      min="1"
      max="365"
      value={estimatedDays}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
    />
  </div>
);
