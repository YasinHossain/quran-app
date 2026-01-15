'use client';

import React from 'react';

import { UnifiedInput } from '@/app/shared/ui/inputs/UnifiedInput';

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

  return (
    <UnifiedInput
      id={inputId}
      label="Set Plan Name"
      type="text"
      value={planName}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter Plan Name"
      maxLength={50}
      rightSlot={<span className="text-muted text-sm">{planName.length}/50</span>}
      {...(hasError ? { errorMessage } : {})}
    />
  );
};
