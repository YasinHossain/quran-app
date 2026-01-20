'use client';

import React, { useCallback, useState } from 'react';

import { useUIState } from '@/app/providers/UIStateContext';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';

import { SettingsSidebarContent } from './SettingsSidebarContent';
import { SettingsSidebarProps } from './types';

import type { ReactElement } from 'react';

export const SettingsSidebar = (props: SettingsSidebarProps): ReactElement => {
  const { isSettingsOpen, setSettingsOpen } = useUIState();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);

  const {
    pageType,
    readerTabsEnabled: readerTabsOverride,
    onTranslationPanelClose,
    onTafsirPanelClose,
    onWordLanguagePanelClose,
    onMushafPanelClose,
    ...restProps
  } = props;

  const contentProps = {
    ...restProps,
    onTranslationPanelClose,
    onTafsirPanelClose,
    onWordLanguagePanelClose,
    onMushafPanelClose,
  };

  const handleCloseSidebar = useCallback((): void => {
    setSettingsOpen(false);
    setIsArabicFontPanelOpen(false);
    onTranslationPanelClose?.();
    onTafsirPanelClose?.();
    onWordLanguagePanelClose?.();
    onMushafPanelClose?.();
  }, [
    setSettingsOpen,
    onTranslationPanelClose,
    onTafsirPanelClose,
    onWordLanguagePanelClose,
    onMushafPanelClose,
  ]);

  const handleArabicFontPanelOpen = useCallback(() => setIsArabicFontPanelOpen(true), []);
  const handleArabicFontPanelClose = useCallback(() => setIsArabicFontPanelOpen(false), []);

  const readerTabsEnabled =
    typeof readerTabsOverride === 'boolean' ? readerTabsOverride : pageType === 'verse';

  return (
    <BaseSidebar
      isOpen={isSettingsOpen}
      onClose={handleCloseSidebar}
      position="right"
      desktopBreakpoint="2xl"
      aria-label="Settings panel"
    >
      <SettingsSidebarContent
        {...contentProps}
        pageType={pageType}
        readerTabsEnabled={readerTabsEnabled}
        showCloseButton
        onClose={handleCloseSidebar}
        idPrefix="mobile-settings"
        isArabicFontPanelOpen={isArabicFontPanelOpen}
        onArabicFontPanelOpen={handleArabicFontPanelOpen}
        onArabicFontPanelClose={handleArabicFontPanelClose}
      />
    </BaseSidebar>
  );
};
