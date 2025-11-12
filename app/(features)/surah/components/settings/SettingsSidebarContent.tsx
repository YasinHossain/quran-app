'use client';

import React, { useCallback, useState } from 'react';

import { useSettingsSections, useSettingsTabState } from '@/app/(features)/surah/hooks';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';

import { SettingsContentWrapper } from './SettingsContentWrapper';
import { SettingsPanels } from './SettingsPanels';
import { buildContentWrapperProps } from './sidebar/SettingsContentWrapperProps';
import { buildPanelsProps } from './sidebar/SettingsPanelsProps';
import { SettingsSidebarProps } from './types';

interface SettingsSidebarContentProps {
  selectedTranslationName?: string | undefined;
  selectedTafsirName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
  showTafsirSetting?: boolean | undefined;
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: (() => void) | undefined;
  onReadingPanelOpen?: (() => void) | undefined;
  isTranslationPanelOpen?: boolean | undefined;
  onTranslationPanelClose?: (() => void) | undefined;
  isTafsirPanelOpen?: boolean | undefined;
  onTafsirPanelClose?: (() => void) | undefined;
  isWordLanguagePanelOpen?: boolean | undefined;
  onWordLanguagePanelClose?: (() => void) | undefined;
  title?: string | undefined;
  showCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
}

export function SettingsSidebarContent({
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  showTafsirSetting,
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTafsirPanelOpen,
  onReadingPanelOpen,
  isTranslationPanelOpen,
  onTranslationPanelClose,
  isTafsirPanelOpen,
  onTafsirPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelClose,
  title = 'Settings',
  showCloseButton,
  onClose,
}: SettingsSidebarContentProps): React.JSX.Element {
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const { activeTab, handleTabChange, tabOptions } = useSettingsTabState(
    onReadingPanelOpen ? { onReadingPanelOpen } : {}
  );
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

  const panelBaseProps: Pick<
    SettingsSidebarProps,
    | 'isTranslationPanelOpen'
    | 'onTranslationPanelClose'
    | 'isTafsirPanelOpen'
    | 'onTafsirPanelClose'
    | 'isWordLanguagePanelOpen'
    | 'onWordLanguagePanelClose'
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
