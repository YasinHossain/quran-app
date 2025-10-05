import React from 'react';

import { cn } from '@/lib/utils/cn';

import type { Chapter } from '@/types';

export function buildButtonClasses(disabled: boolean, open: boolean): string {
  return cn(
    'w-full flex items-center justify-between px-4 py-3.5 bg-surface border border-border rounded-xl text-left text-foreground placeholder-muted transition-all duration-200 shadow-sm',
    !disabled
      ? 'hover:shadow-md hover:border-accent/20 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none'
      : 'opacity-50 cursor-not-allowed',
    open && 'border-accent ring-4 ring-accent/10'
  );
}

export function buildIconClasses(open: boolean): string {
  return cn('text-muted transition-transform duration-200', open && 'rotate-180');
}

export function renderSelectedContent(
  selected: Chapter | undefined,
  placeholder: string
): React.ReactNode {
  if (!selected) return <span className="text-muted">{placeholder}</span>;

  return (
    <>
      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-semibold text-accent">{selected.id}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground truncate">{selected.name_simple}</div>
        <div className="text-xs text-muted truncate">{selected.name_arabic}</div>
      </div>
    </>
  );
}
