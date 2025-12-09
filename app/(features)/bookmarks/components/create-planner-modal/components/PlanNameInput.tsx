'use client';

import React from 'react';

interface PlanNameInputProps {
  planName: string;
  onChange: (planName: string) => void;
  errorMessage?: string;
}

export const PlanNameInput = ({
  planName,
  onChange,
  errorMessage,
}: PlanNameInputProps): React.JSX.Element => {
  const hasError = Boolean(errorMessage);
  const inputId = 'plan-name';
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-semibold text-foreground">
        Set Plan Name
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={planName}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Plan Name"
          className={`w-full rounded-lg border px-4 pr-12 py-3 text-foreground placeholder:text-muted bg-interactive/60 focus:outline-none transition-colors duration-150 ${
            hasError
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
              : 'border-border focus:border-transparent focus:ring-2 focus:ring-accent'
          }`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          maxLength={50}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">
          {planName.length}/50
        </div>
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="text-sm text-error">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
