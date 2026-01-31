'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { SlideOverPanel } from '@/app/shared/components/SlideOverPanel';
import { setUiLanguage } from '@/app/shared/i18n/setUiLanguage';
import { UI_LANGUAGES, isUiLanguageCode, type UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import { ensureUiResourcesLoaded } from '@/app/shared/i18n/uiResourcesClient';
import { setLocaleInPathnameForSwitch } from '@/app/shared/i18n/localeRouting';
import { SettingsPanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';
import { ResourceItem } from '@/app/shared/resource-panel/ResourceItem';

interface UiLanguagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseSidebar?: () => void;
}

export function UiLanguagePanel({
  isOpen,
  onClose,
  onCloseSidebar,
}: UiLanguagePanelProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCode: UiLanguageCode = isUiLanguageCode(i18n.language) ? i18n.language : 'en';

  React.useEffect(() => {
    if (!isOpen) return;
    UI_LANGUAGES.forEach((language) => {
      void ensureUiResourcesLoaded(i18n, language.code).catch(() => {});
    });
  }, [i18n, isOpen]);

  return (
    <SlideOverPanel isOpen={isOpen} testId="ui-language-panel">
      <SettingsPanelHeader
        title={t('language_setting')}
        onClose={onClose}
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
        backIconClassName="h-6 w-6 text-foreground"
      />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4 pt-4 space-y-4">
            <div className="space-y-2">
              {UI_LANGUAGES.map((language) => (
                <ResourceItem
                  key={language.code}
                  item={{ id: language.code, name: language.nativeLabel, lang: language.code }}
                  isSelected={selectedCode === language.code}
                  onToggle={() => {
                    if (selectedCode === language.code) return;
                    const query = searchParams.toString();
                    const hash = typeof window !== 'undefined' ? window.location.hash : '';
                    const nextPath = setLocaleInPathnameForSwitch(pathname, language.code);
                    setUiLanguage(i18n, language.code);
                    router.replace(`${nextPath}${query ? `?${query}` : ''}${hash}`);
                    onClose();
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-muted">{t('language_beta_note')}</p>
          </div>
        </div>
      </div>
    </SlideOverPanel>
  );
}
