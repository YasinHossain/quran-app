'use client';

import React from 'react';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { BookReaderIcon } from '@/app/shared/icons';
import { SelectionBox } from '@/app/shared/SelectionBox';

import type { ReactElement } from 'react';

interface MushafSettingsProps {
  selectedMushafName: string;
  onMushafPanelOpen: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const MushafSettings = ({
  selectedMushafName,
  onMushafPanelOpen,
  isOpen = false,
  onToggle,
}: MushafSettingsProps): ReactElement => {
  return (
    <CollapsibleSection
      title="Mushaf settings"
      icon={<BookReaderIcon size={20} className="text-accent" />}
      isLast
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
    >
      <SelectionBox label="Mushaf" value={selectedMushafName} onClick={onMushafPanelOpen} />
    </CollapsibleSection>
  );
};
