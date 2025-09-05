'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

import { Panel } from './Panel';

import type { SettingsPanelProps } from '@/types/components';

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const SettingItem = ({
  label,
  description,
  children,
  disabled = false,
}: SettingItemProps): React.JSX.Element => (
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

interface ToggleSettingProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleSetting = ({
  label,
  description,
  value,
  onChange,
  disabled = false,
}: ToggleSettingProps): React.JSX.Element => (
  <SettingItem label={label} description={description} disabled={disabled}>
    <button
      onClick={() => !disabled && onChange(!value)}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
        value ? 'bg-accent' : 'bg-surface/50',
        disabled && 'cursor-not-allowed'
      )}
      disabled={disabled}
      aria-pressed={value}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
          value ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  </SettingItem>
);

interface SelectSettingProps {
  label: string;
  description?: string;
  value: string | number;
  options: Array<{ label: string; value: string | number }>;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

const SelectSetting = ({
  label,
  description,
  value,
  options,
  onChange,
  disabled = false,
}: SelectSettingProps): React.JSX.Element => (
  <SettingItem label={label} description={description} disabled={disabled}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
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

interface RangeSettingProps {
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

const RangeSetting = ({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  showValue = true,
}: RangeSettingProps): React.JSX.Element => (
  <SettingItem label={label} description={description} disabled={disabled}>
    <div className="flex items-center space-x-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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

interface SettingsPanelComponentProps extends SettingsPanelProps {
  sections?: Array<{
    title?: string;
    items: React.ReactNode[];
  }>;
  actions?: React.ReactNode[];
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  title = 'Settings',
  sections = [],
  actions = [],
  className,
  children,
}: SettingsPanelComponentProps): React.JSX.Element => {
  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="sidebar"
      className={cn('flex flex-col h-full', className)}
    >
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            {section.title && (
              <h3 className="px-4 py-2 text-sm font-semibold text-muted uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="bg-surface/50 rounded-lg mx-4 mb-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>{item}</div>
              ))}
            </div>
          </div>
        ))}
        {children}
      </div>

      {actions.length > 0 && (
        <div className="border-t border-border p-4 space-y-2">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </Panel>
  );
};

// Export individual setting components for direct use
export { SettingItem, ToggleSetting, SelectSetting, RangeSetting };
