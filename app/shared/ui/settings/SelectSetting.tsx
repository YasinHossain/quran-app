'use client';

import React, { memo, useCallback } from 'react';

import { cn } from '@/lib/utils/cn';

import { SettingItem } from './SettingItem';

export interface SelectSettingOption {
  label: string;
  value: string | number;
}

export interface SelectSettingProps {
  label: string;
  description?: string;
  value: string | number;
  options: SelectSettingOption[];
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

export const SelectSetting = memo(function SelectSetting({
  label,
  description,
  value,
  options,
  onChange,
  disabled = false,
}: SelectSettingProps): React.JSX.Element {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <SettingItem label={label} description={description} disabled={disabled}>
      <select
        value={value}
        onChange={handleChange}
        className={cn(
          'rounded-md border border-border bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent',
          disabled && 'cursor-not-allowed'
        )}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SettingItem>
  );
});
