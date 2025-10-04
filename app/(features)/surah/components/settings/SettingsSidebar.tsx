'use client';

import React, { useState, useCallback } from 'react';
import type { ReactElement } from 'react';

import { useSettingsTabState, useSettingsSections } from '@/app/(features)/surah/hooks';
import { useUIState } from '@/app/providers/UIStateContext';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';

import { SettingsContentWrapper } from './SettingsContentWrapper';
import { SettingsPanels } from './SettingsPanels';
import { buildContentWrapperProps } from './sidebar/SettingsContentWrapperProps';
import { buildPanelsProps } from './sidebar/SettingsPanelsProps';
import { SettingsSidebarProps } from './types';

export const SettingsSidebar = (props: SettingsSidebarProps): ReactElement => {
  const { isSettingsOpen, setSettingsOpen } = useUIState();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);

  const { activeTab, handleTabChange, tabOptions } = useSettingsTabState({
    ...(props.onReadingPanelOpen !== undefined
      ? { onReadingPanelOpen: props.onReadingPanelOpen }
      : {}),
  });
  const { openSections, handleSectionToggle } = useSettingsSections();

  const handleCloseSidebar = useCallback((): void => setSettingsOpen(false), [setSettingsOpen]);
  const handleOpenArabicFontPanel = useCallback((): void => setIsArabicFontPanelOpen(true), []);
  const handleCloseArabicFontPanel = useCallback((): void => setIsArabicFontPanelOpen(false), []);

  const contentWrapperProps = buildContentWrapperProps(props, {
    activeTab,
    onTabChange: handleTabChange,
    tabOptions,
    openSections,
    onSectionToggle: handleSectionToggle,
    onArabicFontPanelOpen: handleOpenArabicFontPanel,
  });

  const panelsProps = buildPanelsProps(props, {
    isArabicFontPanelOpen,
    onArabicFontPanelClose: handleCloseArabicFontPanel,
  });

  return (
    <BaseSidebar
      isOpen={isSettingsOpen}
      onClose={handleCloseSidebar}
      position="right"
      aria-label="Settings panel"
    >
      <SettingsContentWrapper {...contentWrapperProps} />
      <SettingsPanels {...panelsProps} />
    </BaseSidebar>
  );
};
