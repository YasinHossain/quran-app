'use client';

import React, { useCallback, useState } from 'react';

import { SettingsContentWrapper } from '@/app/(features)/surah/components/settings/SettingsContentWrapper';
import { SettingsPanels } from '@/app/(features)/surah/components/settings/SettingsPanels';
import { buildContentWrapperProps } from '@/app/(features)/surah/components/settings/sidebar/SettingsContentWrapperProps';
import { buildPanelsProps } from '@/app/(features)/surah/components/settings/sidebar/SettingsPanelsProps';
import { useSettingsSections, useSettingsTabState } from '@/app/(features)/surah/hooks';

interface TafsirWorkspaceSettingsProps {
  selectedTranslationName: string;
  selectedTafsirName: string;
  selectedWordLanguageName: string;
  isTranslationPanelOpen: boolean;
  onTranslationPanelOpen: () => void;
  onTranslationPanelClose: () => void;
  isTafsirPanelOpen: boolean;
  onTafsirPanelOpen: () => void;
  onTafsirPanelClose: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelOpen: () => void;
  onWordLanguagePanelClose: () => void;
}

export function TafsirWorkspaceSettings({
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelOpen,
  onTranslationPanelClose,
  isTafsirPanelOpen,
  onTafsirPanelOpen,
  onTafsirPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelOpen,
  onWordLanguagePanelClose,
}: TafsirWorkspaceSettingsProps): React.JSX.Element {
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const { activeTab, handleTabChange, tabOptions } = useSettingsTabState({
    onReadingPanelOpen: () => {},
  });
  const { openSections, handleSectionToggle } = useSettingsSections();

  const handleArabicFontPanelOpen = useCallback(() => setIsArabicFontPanelOpen(true), []);
  const handleArabicFontPanelClose = useCallback(() => setIsArabicFontPanelOpen(false), []);

  const contentWrapperProps = buildContentWrapperProps(
    {
      onTranslationPanelOpen,
      onTafsirPanelOpen,
      onWordLanguagePanelOpen,
      selectedTranslationName,
      selectedTafsirName,
      selectedWordLanguageName,
      showTafsirSetting: true,
    },
    {
      activeTab,
      onTabChange: handleTabChange,
      tabOptions,
      openSections,
      onSectionToggle: handleSectionToggle,
      onArabicFontPanelOpen: handleArabicFontPanelOpen,
    }
  );

  const panelsProps = buildPanelsProps(
    {
      isTranslationPanelOpen,
      onTranslationPanelClose,
      isTafsirPanelOpen,
      onTafsirPanelClose,
      isWordLanguagePanelOpen,
      onWordLanguagePanelClose,
    },
    {
      isArabicFontPanelOpen,
      onArabicFontPanelClose: handleArabicFontPanelClose,
    }
  );

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="flex flex-none items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-content-primary">Settings</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <SettingsContentWrapper {...contentWrapperProps} />
      </div>
      <SettingsPanels {...panelsProps} />
    </div>
  );
}
