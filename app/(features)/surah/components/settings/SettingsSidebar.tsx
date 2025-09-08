'use client';

import React, { useState, useCallback } from 'react';

import { useUIState } from '@/app/providers/UIStateContext';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';

import { SettingsContentWrapper } from './SettingsContentWrapper';
import { SettingsPanels } from './SettingsPanels';
import { SettingsSidebarProps } from './types';
import { useSettingsTabState, useSettingsSections } from '../../hooks';
import { buildContentWrapperProps } from './sidebar/SettingsContentWrapperProps';
import { buildPanelsProps } from './sidebar/SettingsPanelsProps';

export const SettingsSidebar = (props: SettingsSidebarProps) => {
  const { isSettingsOpen, setSettingsOpen } = useUIState();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);

  const { activeTab, handleTabChange, tabOptions } = useSettingsTabState({
    ...(props.onReadingPanelOpen !== undefined
      ? { onReadingPanelOpen: props.onReadingPanelOpen }
      : {}),
  });
  const { openSections, handleSectionToggle } = useSettingsSections();

  const handleCloseSidebar = useCallback(() => setSettingsOpen(false), [setSettingsOpen]);
  const handleOpenArabicFontPanel = useCallback(() => setIsArabicFontPanelOpen(true), []);
  const handleCloseArabicFontPanel = useCallback(() => setIsArabicFontPanelOpen(false), []);

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
