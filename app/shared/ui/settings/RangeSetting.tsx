'use client';

import React, { memo, useCallback } from 'react';

import { cn } from '@/lib/utils/cn';

import { SettingItem } from './SettingItem';

export interface RangeSettingProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
}

export const RangeSetting = memo(function RangeSetting({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  showValue = true,
}: RangeSettingProps): React.JSX.Element {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)),
    [onChange]
  );

  return (
    <SettingItem label={label} description={description} disabled={disabled}>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={cn(
            'w-20 h-2 bg-surface/50 rounded-lg appearance-none cursor-pointer slider',
            disabled && 'cursor-not-allowed'
          )}
          disabled={disabled}
        />
        {showValue && <span className="text-sm text-muted min-w-8 text-center">{value}</span>}
      </div>
    </SettingItem>
  );
});
