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

  const { pageType, readerTabsEnabled: readerTabsOverride, ...contentProps } = props;

  const handleCloseSidebar = useCallback((): void => {
    setSettingsOpen(false);
    setIsArabicFontPanelOpen(false);
    props.onTranslationPanelClose?.();
    props.onTafsirPanelClose?.();
    props.onWordLanguagePanelClose?.();
    props.onMushafPanelClose?.();
  }, [
    setSettingsOpen,
    props.onTranslationPanelClose,
    props.onTafsirPanelClose,
    props.onWordLanguagePanelClose,
    props.onMushafPanelClose,
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
