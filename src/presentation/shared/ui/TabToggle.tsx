'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TabToggleProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TabToggle: React.FC<TabToggleProps> = ({ options, value, onChange, className }) => {
  return (
    <div
      className={cn(
        'flex items-center p-1 rounded-full bg-interactive border border-border',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors',
            value === option.value
              ? 'bg-surface shadow text-foreground'
              : 'text-muted hover:text-foreground hover:bg-surface/30'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
