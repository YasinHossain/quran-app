'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { GlobeIcon } from '@/app/shared/icons';
import { LanguageSwitcher } from '@/app/shared/ui/LanguageSwitcher';

import type { ReactElement } from 'react';

interface LanguageSettingsProps {
  isOpen?: boolean;
  onToggle?: () => void;
  idPrefix?: string;
}

export const LanguageSettings = ({
  isOpen = false,
  onToggle,
}: LanguageSettingsProps): ReactElement => {
  const { t } = useTranslation();

  return (
    <CollapsibleSection
      title={t('language_setting')}
      icon={<GlobeIcon size={20} className="text-accent" />}
      isLast
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
    >
      <div className="pt-2 pb-2">
        <LanguageSwitcher variant="tabs" className="w-full justify-center" />
      </div>
    </CollapsibleSection>
  );
};
