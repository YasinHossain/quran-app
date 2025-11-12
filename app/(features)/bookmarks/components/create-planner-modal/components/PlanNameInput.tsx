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
          className={`w-full rounded-xl border bg-surface px-4 py-3.5 text-foreground placeholder-muted transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none ${
            hasError
              ? 'border-error focus:border-error focus:ring-4 focus:ring-error/20'
              : 'border-border focus:border-accent focus:ring-4 focus:ring-accent/10'
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
