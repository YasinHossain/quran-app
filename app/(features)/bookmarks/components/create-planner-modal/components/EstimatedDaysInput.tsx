'use client';

import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface EstimatedDaysInputProps {
  estimatedDays: number;
  onChange: (days: number) => void;
}

export const EstimatedDaysInput = ({
  estimatedDays,
  onChange,
}: EstimatedDaysInputProps): React.JSX.Element => {
  const handleIncrement = () => onChange(estimatedDays + 1);
  const handleDecrement = () => {
    if (estimatedDays > 1) {
      onChange(estimatedDays - 1);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="estimated-days" className="block text-sm font-semibold text-foreground">
        Estimated Days
      </label>
      <div className="flex items-center w-full rounded-lg border border-border bg-interactive/60 text-foreground focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors duration-150">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={estimatedDays <= 1}
          className="p-3 text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
        >
          <Minus size={16} />
        </button>
        <input
          id="estimated-days"
          type="number"
          min="1"
          max="365"
          value={estimatedDays}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            onChange(Number.isNaN(v) ? estimatedDays : v);
          }}
          className="flex-1 min-w-0 bg-transparent p-3 text-center text-foreground placeholder:text-muted focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={estimatedDays >= 365}
          className="p-3 text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
