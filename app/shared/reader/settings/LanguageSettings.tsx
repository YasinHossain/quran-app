'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getUiLanguageLabel } from '@/app/shared/i18n/uiLanguages';
import { ChevronRightIcon, GlobeIcon } from '@/app/shared/icons';

import { UiLanguagePanel } from './UiLanguagePanel';

import type { ReactElement } from 'react';

interface LanguageSettingsProps {
  isOpen?: boolean;
  onToggle?: () => void;
  idPrefix?: string;
}

export const LanguageSettings = ({ idPrefix }: LanguageSettingsProps): ReactElement => {
  const { t, i18n } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const currentLanguage = getUiLanguageLabel(i18n.language);

  return (
    <>
      <button
        type="button"
        {...(idPrefix ? { id: `${idPrefix}-language-trigger` } : {})}
        onClick={() => setIsPanelOpen(true)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-label={t('language_setting')}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <GlobeIcon size={20} className="text-accent" />
          <span className="font-semibold text-foreground">{t('language_setting')}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm text-muted truncate max-w-[10rem]">{currentLanguage}</span>
          <ChevronRightIcon size={16} className="text-muted-foreground" aria-hidden="true" />
        </div>
      </button>

      <UiLanguagePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};
