'use client';

import React, { useId } from 'react';

import { PanelHeader } from '@/app/(features)/surah/components/PanelHeader';
import { cn } from '@/lib/utils/cn';

import type { MushafOption } from '@/types';

interface MushafPanelProps {
  isOpen: boolean;
  onClose: () => void;
  options: MushafOption[];
  selectedId?: string;
  onSelect: (mushafId: string) => void;
}

export const MushafPanel = ({
  isOpen,
  onClose,
  options,
  selectedId,
  onSelect,
}: MushafPanelProps): React.JSX.Element => {
  const groupId = useId();

  const handleSelect = (id: string): void => {
    onSelect(id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${groupId}-title`}
      data-testid="mushaf-panel"
      className={cn(
        'absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg bg-background text-foreground',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <PanelHeader title="Select mushaf" onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
        <div role="radiogroup" aria-labelledby={`${groupId}-title`} className="space-y-3">
          <h2 id={`${groupId}-title`} className="sr-only">
            Select mushaf
          </h2>
          {options.map((option) => (
            <MushafOptionRow
              key={option.id}
              option={option}
              selected={selectedId === option.id}
              onSelect={(): void => handleSelect(option.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MushafOptionRowProps {
  option: MushafOption;
  selected: boolean;
  onSelect: () => void;
}

const MushafOptionRow = ({ option, selected, onSelect }: MushafOptionRowProps): React.JSX.Element => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event): void => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'w-full rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        selected ? 'border-accent bg-accent/10' : 'border-border bg-surface hover:bg-interactive'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{option.name}</p>
          {option.description && (
            <p className="text-xs text-muted mt-1 line-clamp-2">{option.description}</p>
          )}
          {(option.script || option.lines) && (
            <p className="text-xs text-muted mt-2">
              {[option.script, option.lines ? `${option.lines}-line` : null]
                .filter(Boolean)
                .join(' • ')}
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
            selected ? 'border-accent bg-accent text-on-accent' : 'border-border text-transparent'
          )}
        >
          ●
        </span>
      </div>
    </button>
  );
};

