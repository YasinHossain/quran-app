'use client';

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsSections, useSettingsTabState } from '@/app/(features)/surah/hooks';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';

import { SettingsContentWrapper } from './SettingsContentWrapper';
import { SettingsPanels } from './SettingsPanels';
import { buildContentWrapperProps } from './sidebar/SettingsContentWrapperProps';
import { buildPanelsProps } from './sidebar/SettingsPanelsProps';
import { SettingsSidebarProps, SettingsTabValue } from './types';

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
  idPrefix?: string;
  isArabicFontPanelOpen?: boolean;
  onArabicFontPanelOpen?: () => void;
  onArabicFontPanelClose?: () => void;
  pageType?: 'verse' | 'tafsir' | 'bookmarks';
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
  title: titleProp,
  showCloseButton,
  onClose,
  activeReaderMode,
  readerTabsEnabled = true,
  idPrefix: _idPrefix,
  isArabicFontPanelOpen: isArabicFontPanelOpenProp,
  onArabicFontPanelOpen: onArabicFontPanelOpenProp,
  onArabicFontPanelClose: onArabicFontPanelCloseProp,
  pageType,
}: SettingsSidebarContentProps): React.JSX.Element {
  void _idPrefix;
  const { t } = useTranslation();
  const [internalArabicFontPanelOpen, setInternalArabicFontPanelOpen] = useState(false);
  const [internalTajweedRulesPanelOpen, setInternalTajweedRulesPanelOpen] = useState(false);
  const title = titleProp ?? t('settings');

  const isArabicFontPanelOpen = isArabicFontPanelOpenProp ?? internalArabicFontPanelOpen;
  const isTajweedRulesPanelOpen = internalTajweedRulesPanelOpen;

  const tabsEnabled = readerTabsEnabled;
  const isMushafMode = activeReaderMode === 'reading';
  const hookTabState = useSettingsTabState(
    onReadingPanelOpen || onTranslationTabOpen || activeReaderMode
      ? {
        ...(onReadingPanelOpen ? { onReadingPanelOpen } : {}),
        ...(onTranslationTabOpen ? { onTranslationTabOpen } : {}),
        ...(activeReaderMode ? { activeTabOverride: activeReaderMode } : {}),
      }
      : {}
  );

  const tabState = tabsEnabled
    ? hookTabState
    : {
      activeTab: 'translation' as const,
      handleTabChange: () => { },
      tabOptions: [{ value: 'translation', label: t('translations') }] as Array<{
        value: SettingsTabValue;
        label: string;
      }>,
    };

  const { activeTab, handleTabChange, tabOptions } = tabState;
  const { openSections, handleSectionToggle } = useSettingsSections(
    pageType === 'tafsir'
      ? { defaultOpenSections: ['tafsir', 'translation', 'font'] }
      : isMushafMode
        ? { defaultOpenSections: ['mushaf'] }
        : undefined
  );

  const handleArabicFontPanelOpen = useCallback(() => {
    onArabicFontPanelOpenProp?.();
    setInternalArabicFontPanelOpen(true);
  }, [onArabicFontPanelOpenProp]);

  const handleArabicFontPanelClose = useCallback(() => {
    onArabicFontPanelCloseProp?.();
    setInternalArabicFontPanelOpen(false);
  }, [onArabicFontPanelCloseProp]);

  const handleTajweedRulesPanelOpen = useCallback(() => {
    setInternalTajweedRulesPanelOpen(true);
  }, []);

  const handleTajweedRulesPanelClose = useCallback(() => {
    setInternalTajweedRulesPanelOpen(false);
  }, []);

  // Wrapped close handler that resets internal panel states
  const handleSidebarClose = useCallback(() => {
    setInternalArabicFontPanelOpen(false);
    setInternalTajweedRulesPanelOpen(false);
    onClose?.();
  }, [onClose]);

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
      onTajweedRulesPanelOpen: handleTajweedRulesPanelOpen,
      ...(activeReaderMode ? { activeTabOverride: activeReaderMode } : {}),
      showTabs: tabsEnabled,
      isMushafMode,
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
    isTajweedRulesPanelOpen,
    onTajweedRulesPanelClose: handleTajweedRulesPanelClose,
  });

  const shouldShowCloseButton = Boolean(showCloseButton && onClose);

  return (
    <div className="relative flex h-full flex-col bg-background text-foreground overflow-hidden">
      <SidebarHeader
        title={title}
        titleClassName="text-mobile-lg font-semibold text-content-primary"
        className="2xl:hidden !z-0"
        showCloseButton={shouldShowCloseButton}
        {...(shouldShowCloseButton && onClose ? { onClose: handleSidebarClose } : {})}
        forceVisible
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <SettingsContentWrapper {...contentWrapperProps} pageType={pageType} />
      </div>
      <SettingsPanels
        {...panelsProps}
        {...(onClose ? { onCloseSidebar: handleSidebarClose } : {})}
      />
    </div>
  );
}
