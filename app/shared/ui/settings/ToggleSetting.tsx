'use client';

import React, { memo, useCallback } from 'react';

import { cn } from '@/lib/utils/cn';

import { SettingItem } from './SettingItem';

export interface ToggleSettingProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const ToggleSetting = memo(function ToggleSetting({
  label,
  description,
  value,
  onChange,
  disabled = false,
}: ToggleSettingProps): React.JSX.Element {
  const handleToggle = useCallback(() => {
    if (!disabled) onChange(!value);
  }, [disabled, onChange, value]);

  return (
    <SettingItem
      label={label}
      {...(description !== undefined ? { description } : {})}
      disabled={disabled}
    >
      <button
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          value ? 'bg-accent' : 'bg-surface/50',
          disabled && 'cursor-not-allowed'
        )}
        disabled={disabled}
        role="switch"
        aria-checked={value}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-on-accent shadow transform ring-0 transition duration-200 ease-in-out',
            value ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </SettingItem>
  );
});
