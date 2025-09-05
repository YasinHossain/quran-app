'use client';

import React from 'react';

import { BookReaderIcon } from '@/app/shared/icons';

import { CollapsibleSection } from '../CollapsibleSection';

interface ReadingSettingsProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ReadingSettings = ({ isOpen = false, onToggle }: ReadingSettingsProps) => {
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
