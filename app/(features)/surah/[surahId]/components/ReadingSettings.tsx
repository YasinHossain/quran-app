'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookReaderIcon } from '@/app/shared/icons';
import { CollapsibleSection } from './CollapsibleSection';

interface ReadingSettingsProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ReadingSettings = ({ isOpen = false, onToggle }: ReadingSettingsProps) => {
  const { t } = useTranslation();

  return (
    <CollapsibleSection
      title="Mushaf Settings"
      icon={<BookReaderIcon size={20} className="text-teal-700" />}
      isLast={false}
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
    >
      <div className="text-center py-8 text-gray-500">Coming soon...</div>
    </CollapsibleSection>
  );
};
