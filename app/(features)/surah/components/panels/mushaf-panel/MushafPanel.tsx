'use client';

import React, { useId } from 'react';

import { SlideOverPanel } from '@/app/shared/components/SlideOverPanel';
import { SettingsPanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';
import { ResourceItem } from '@/app/shared/resource-panel/ResourceItem';

import type { MushafOption } from '@/types';

interface MushafPanelProps {
  isOpen: boolean;
  onClose: () => void;
  options: MushafOption[];
  selectedId?: string | undefined;
  onSelect: (mushafId: string) => void;
  onCloseSidebar?: () => void;
}

export const MushafPanel = ({
  isOpen,
  onClose,
  options,
  selectedId,
  onSelect,
  onCloseSidebar,
}: MushafPanelProps): React.JSX.Element => {
  const groupId = useId();

  const handleSelect = (id: string): void => {
    onSelect(id);
    onClose();
  };

  return (
    <SlideOverPanel isOpen={isOpen} testId="mushaf-panel">
      <SettingsPanelHeader
        title="Select mushaf"
        onClose={onClose}
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
        backIconClassName="h-6 w-6 text-foreground"
      />
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
    </SlideOverPanel>
  );
};
