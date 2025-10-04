'use client';

import React from 'react';
import type { ReactElement } from 'react';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { BookReaderIcon } from '@/app/shared/icons';

interface ReadingSettingsProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ReadingSettings = ({
  isOpen = false,
  onToggle,
}: ReadingSettingsProps): ReactElement => {
  return (
    <CollapsibleSection
      title="Mushaf Settings"
      icon={<BookReaderIcon size={20} className="text-accent" />}
      isLast={false}
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
    >
      <div className="text-center py-8 text-muted">Coming soon...</div>
    </CollapsibleSection>
  );
};
