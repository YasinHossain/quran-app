'use client';

import React, { memo } from 'react';

import { cn } from '@/lib/utils/cn';

export interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const SettingItem = memo(function SettingItem({
  label,
  description,
  children,
  disabled = false,
}: SettingItemProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b border-border last:border-b-0',
        disabled && 'opacity-50'
      )}
    >
      <div className="flex-1 min-w-0 mr-4">
        <h4 className="font-medium text-foreground">{label}</h4>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
});
