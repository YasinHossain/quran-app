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
      className="w-full rounded-lg border border-border bg-interactive/60 px-4 py-3 text-foreground placeholder:text-muted focus:border-transparent focus:ring-2 focus:ring-accent focus:outline-none transition-colors duration-150"
    />
  </div>
);
