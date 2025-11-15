'use client';

import React, { useCallback, useState } from 'react';

import { useSettingsSections, useSettingsTabState } from '@/app/(features)/surah/hooks';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';

import { SettingsContentWrapper } from './SettingsContentWrapper';
import { SettingsPanels } from './SettingsPanels';
import { buildContentWrapperProps } from './sidebar/SettingsContentWrapperProps';
import { buildPanelsProps } from './sidebar/SettingsPanelsProps';
import { SettingsSidebarProps } from './types';

import type { MushafOption } from '@/types';

interface SettingsSidebarContentProps {
  selectedTranslationName?: string | undefined;
  selectedTafsirName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
  selectedMushafName?: string | undefined;
  selectedMushafId?: string | undefined;
  showTafsirSetting?: boolean | undefined;
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: (() => void) | undefined;
  onReadingPanelOpen?: (() => void) | undefined;
  onTranslationTabOpen?: (() => void) | undefined;
  onMushafPanelOpen?: (() => void) | undefined;
  isTranslationPanelOpen?: boolean | undefined;
  onTranslationPanelClose?: (() => void) | undefined;
  isTafsirPanelOpen?: boolean | undefined;
  onTafsirPanelClose?: (() => void) | undefined;
  isWordLanguagePanelOpen?: boolean | undefined;
  onWordLanguagePanelClose?: (() => void) | undefined;
  isMushafPanelOpen?: boolean | undefined;
  onMushafPanelClose?: (() => void) | undefined;
  mushafOptions?: MushafOption[] | undefined;
  onMushafChange?: ((id: string) => void) | undefined;
  title?: string | undefined;
  showCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  activeReaderMode?: 'translation' | 'reading';
  readerTabsEnabled?: boolean;
}

export function SettingsSidebarContent({
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  selectedMushafName,
  selectedMushafId,
  showTafsirSetting,
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTafsirPanelOpen,
  onReadingPanelOpen,
  onTranslationTabOpen,
  onMushafPanelOpen,
  isTranslationPanelOpen,
  onTranslationPanelClose,
  isTafsirPanelOpen,
  onTafsirPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelClose,
  isMushafPanelOpen,
  onMushafPanelClose,
  mushafOptions,
  onMushafChange,
  title = 'Settings',
  showCloseButton,
  onClose,
  activeReaderMode,
  readerTabsEnabled = true,
}: SettingsSidebarContentProps): React.JSX.Element {
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const tabsEnabled = readerTabsEnabled;
  const tabState = tabsEnabled
    ? useSettingsTabState(
        onReadingPanelOpen || onTranslationTabOpen || activeReaderMode
          ? {
              ...(onReadingPanelOpen ? { onReadingPanelOpen } : {}),
              ...(onTranslationTabOpen ? { onTranslationTabOpen } : {}),
              ...(activeReaderMode ? { activeTabOverride: activeReaderMode } : {}),
            }
          : {}
      )
    : {
        activeTab: 'translation' as const,
        handleTabChange: () => {},
        tabOptions: [{ value: 'translation', label: 'Translation' }] as const,
      };

  const { activeTab, handleTabChange, tabOptions } = tabState;
  const { openSections, handleSectionToggle } = useSettingsSections();

  const handleArabicFontPanelOpen = useCallback(() => setIsArabicFontPanelOpen(true), []);
  const handleArabicFontPanelClose = useCallback(() => setIsArabicFontPanelOpen(false), []);

  const contentWrapperProps = buildContentWrapperProps(
    {
      onTranslationPanelOpen,
      ...(onTafsirPanelOpen ? { onTafsirPanelOpen } : {}),
      onWordLanguagePanelOpen,
      selectedTranslationName: selectedTranslationName ?? '',
      ...(selectedTafsirName !== undefined ? { selectedTafsirName } : {}),
      selectedWordLanguageName: selectedWordLanguageName ?? '',
      showTafsirSetting: showTafsirSetting ?? false,
      selectedMushafName: selectedMushafName ?? '',
      ...(onMushafPanelOpen ? { onMushafPanelOpen } : {}),
    },
    {
      activeTab,
      onTabChange: handleTabChange,
      tabOptions,
      openSections,
      onSectionToggle: handleSectionToggle,
      onArabicFontPanelOpen: handleArabicFontPanelOpen,
      activeTabOverride: activeReaderMode,
      showTabs: tabsEnabled,
    }
  );

  const panelBaseProps: Pick<
    SettingsSidebarProps,
    | 'isTranslationPanelOpen'
    | 'onTranslationPanelClose'
    | 'isTafsirPanelOpen'
    | 'onTafsirPanelClose'
    | 'isWordLanguagePanelOpen'
    | 'onWordLanguagePanelClose'
    | 'isMushafPanelOpen'
    | 'onMushafPanelClose'
    | 'mushafOptions'
    | 'selectedMushafId'
    | 'onMushafChange'
  > = {};

  if (typeof isTranslationPanelOpen !== 'undefined') {
    panelBaseProps.isTranslationPanelOpen = isTranslationPanelOpen;
  }
  if (typeof isTafsirPanelOpen !== 'undefined') {
    panelBaseProps.isTafsirPanelOpen = isTafsirPanelOpen;
  }
  if (typeof isWordLanguagePanelOpen !== 'undefined') {
    panelBaseProps.isWordLanguagePanelOpen = isWordLanguagePanelOpen;
  }
  if (onTranslationPanelClose) {
    panelBaseProps.onTranslationPanelClose = onTranslationPanelClose;
  }
  if (onTafsirPanelClose) {
    panelBaseProps.onTafsirPanelClose = onTafsirPanelClose;
  }
  if (onWordLanguagePanelClose) {
    panelBaseProps.onWordLanguagePanelClose = onWordLanguagePanelClose;
  }
  if (typeof isMushafPanelOpen !== 'undefined') {
    panelBaseProps.isMushafPanelOpen = isMushafPanelOpen;
  }
  if (onMushafPanelClose) {
    panelBaseProps.onMushafPanelClose = onMushafPanelClose;
  }
  if (mushafOptions) {
    panelBaseProps.mushafOptions = mushafOptions;
  }
  if (selectedMushafId) {
    panelBaseProps.selectedMushafId = selectedMushafId;
  }
  if (onMushafChange) {
    panelBaseProps.onMushafChange = onMushafChange;
  }

  const panelsProps = buildPanelsProps(panelBaseProps, {
    isArabicFontPanelOpen,
    onArabicFontPanelClose: handleArabicFontPanelClose,
  });

  const shouldShowCloseButton = Boolean(showCloseButton && onClose);

  return (
    <div className="relative flex h-full flex-col bg-background text-foreground overflow-x-hidden">
      <SidebarHeader
        title={title}
        titleAlign="center"
        titleClassName="text-mobile-lg font-semibold text-content-primary"
        withShadow={false}
        edgeToEdge
        contentClassName="h-16 min-h-12 px-3 sm:px-4 py-0 sm:py-0"
        className="border-b border-border bg-background shadow-none"
        showCloseButton={shouldShowCloseButton}
        {...(shouldShowCloseButton && onClose ? { onClose } : {})}
      />
      <div className="flex-1 overflow-hidden">
        <SettingsContentWrapper {...contentWrapperProps} />
      </div>
      <SettingsPanels {...panelsProps} />
    </div>
  );
}
