'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useFontSize } from '@/app/(features)/surah/hooks/useFontSize';
import { useSettings } from '@/app/providers/SettingsContext';

import { FontSettingsContent } from './font-settings/FontSettingsContent';

import type { ReactElement } from 'react';

interface FontSettingsProps {
  onArabicFontPanelOpen: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  idPrefix?: string;
  isArabicOnly?: boolean;
}

export const FontSettings = ({
  onArabicFontPanelOpen,
  isOpen = false,
  onToggle,
  idPrefix,
  isArabicOnly = false,
}: FontSettingsProps): ReactElement => {
  const { settings, arabicFonts, setArabicFontSize, setTranslationFontSize } = useSettings();
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const { style: arabicStyle } = useFontSize(settings.arabicFontSize, 16, 64);
  const { style: translationStyle } = useFontSize(settings.translationFontSize, 12, 48);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleArabicFontSizeChange = useCallback(
    (value: number): void => {
      setArabicFontSize(value);
    },
    [setArabicFontSize]
  );

  const handleTranslationFontSizeChange = useCallback(
    (value: number): void => {
      setTranslationFontSize(value);
    },
    [setTranslationFontSize]
  );

  const selectedArabicFont = useMemo(() => {
    if (!isClient) return '';
    return (
      arabicFonts.find((font) => font.value === settings.arabicFontFace)?.name || t('select_font')
    );
  }, [arabicFonts, isClient, settings.arabicFontFace, t]);

  return (
    <FontSettingsContent
      isOpen={isOpen}
      {...(onToggle ? { onToggle } : {})}
      settings={settings}
      arabicStyle={arabicStyle}
      translationStyle={translationStyle}
      selectedArabicFont={selectedArabicFont}
      onArabicFontPanelOpen={onArabicFontPanelOpen}
      handleArabicFontSizeChange={handleArabicFontSizeChange}
      handleTranslationFontSizeChange={handleTranslationFontSizeChange}
      {...(idPrefix ? { idPrefix } : {})}
      isArabicOnly={isArabicOnly}
    />
  );
};
