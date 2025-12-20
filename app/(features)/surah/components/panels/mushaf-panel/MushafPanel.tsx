'use client';

import React, { useId } from 'react';

import { PanelHeader } from '@/app/(features)/surah/components/PanelHeader';
import { ResourceItem } from '@/app/shared/resource-panel/ResourceItem';
import { cn } from '@/lib/utils/cn';

import type { MushafOption } from '@/types';

interface MushafPanelProps {
  isOpen: boolean;
  onClose: () => void;
  options: MushafOption[];
  selectedId?: string | undefined;
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
        <div role="radiogroup" aria-labelledby={`${groupId}-title`} className="space-y-2">
          <h2 id={`${groupId}-title`} className="sr-only">
            Select mushaf
          </h2>
          {options.map((option) => (
            <React.Fragment key={option.id}>
              <ResourceItem
                item={{ id: option.id, name: option.name, lang: 'ar' }}
                isSelected={selectedId === option.id}
                onToggle={() => handleSelect(option.id)}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
