'use client';

import React from 'react';

import { CounterInput } from '@/app/shared/ui/inputs/CounterInput';

interface EstimatedDaysInputProps {
  estimatedDays: number;
  onChange: (days: number) => void;
}

export const EstimatedDaysInput = ({
  estimatedDays,
  onChange,
}: EstimatedDaysInputProps): React.JSX.Element => {
  return (
    <CounterInput
      label="Estimated Days"
      value={estimatedDays}
      onChange={onChange}
      min={1}
      max={365}
    />
  );
};
