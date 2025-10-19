'use client';

import React, { useCallback, useState } from 'react';

import { SettingsContentWrapper } from '@/app/(features)/surah/components/settings/SettingsContentWrapper';
import { SettingsPanels } from '@/app/(features)/surah/components/settings/SettingsPanels';
import { buildContentWrapperProps } from '@/app/(features)/surah/components/settings/sidebar/SettingsContentWrapperProps';
import { buildPanelsProps } from '@/app/(features)/surah/components/settings/sidebar/SettingsPanelsProps';
import { useSettingsSections, useSettingsTabState } from '@/app/(features)/surah/hooks';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';

interface SurahWorkspaceSettingsProps {
  selectedTranslationName?: string;
  selectedWordLanguageName?: string;
  isTranslationPanelOpen: boolean;
  onTranslationPanelOpen: () => void;
  onTranslationPanelClose: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelOpen: () => void;
  onWordLanguagePanelClose: () => void;
}

export function SurahWorkspaceSettings({
  selectedTranslationName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelOpen,
  onTranslationPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelOpen,
  onWordLanguagePanelClose,
}: SurahWorkspaceSettingsProps): React.JSX.Element {
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
      onWordLanguagePanelOpen,
      selectedTranslationName: selectedTranslationName ?? '',
      selectedWordLanguageName: selectedWordLanguageName ?? '',
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
      isWordLanguagePanelOpen,
      onWordLanguagePanelClose,
    },
    {
      isArabicFontPanelOpen,
      onArabicFontPanelClose: handleArabicFontPanelClose,
    }
  );

  return (
    <div className="relative flex h-full flex-col bg-background text-foreground">
      <SidebarHeader
        title="Settings"
        titleAlign="center"
        titleClassName="text-mobile-lg font-semibold text-content-primary"
        withShadow={false}
        edgeToEdge
        contentClassName="h-16 min-h-12 px-3 sm:px-4 py-0 sm:py-0"
        className="border-b border-border bg-background shadow-none"
      />
      <div className="flex-1 overflow-hidden">
        <SettingsContentWrapper {...contentWrapperProps} />
      </div>
      <SettingsPanels {...panelsProps} />
    </div>
  );
}


