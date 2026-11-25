'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { SlideOverPanel } from '@/app/shared/components/SlideOverPanel';
import { SettingsPanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';
import { useListHeight } from '@/app/shared/resource-panel/hooks/useListHeight';

import { TranslationPanelContent } from './components/TranslationPanelContent';
import { useTranslationSections } from './hooks/useTranslationSections';
import { useTranslationPanel } from './useTranslationPanel';

interface TranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseSidebar?: () => void;
}

export const TranslationPanel = ({
  isOpen,
  onClose,
  onCloseSidebar,
}: TranslationPanelProps): React.JSX.Element => {
  return (
    <SlideOverPanel isOpen={isOpen} testId="translation-panel">
      <TranslationPanelBody onClose={onClose} {...(onCloseSidebar ? { onCloseSidebar } : {})} />
    </SlideOverPanel>
  );
};

function TranslationPanelBody({
  onClose,
  onCloseSidebar,
}: {
  onClose: () => void;
  onCloseSidebar?: () => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const panelData = useTranslationPanel();
  const { listContainerRef, listHeight } = useListHeight(true);
  const { resourcesToRender, sectionsToRender } = useTranslationSections(
    panelData.activeFilter,
    panelData.translations,
    panelData.groupedTranslations
  );

  return (
    <>
      <SettingsPanelHeader
        title={t('manage_translations')}
        onClose={onClose}
        backIconClassName="h-6 w-6 text-foreground"
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <TranslationPanelContent
          loading={panelData.loading}
          error={panelData.error}
          searchTerm={panelData.searchTerm}
          setSearchTerm={panelData.setSearchTerm}
          orderedSelection={panelData.orderedSelection}
          translations={panelData.translations}
          handleSelectionToggle={panelData.handleSelectionToggle}
          onReorder={panelData.setSelections}
          onReset={panelData.handleReset}
          languages={panelData.languages}
          activeFilter={panelData.activeFilter}
          setActiveFilter={panelData.setActiveFilter}
          tabsContainerRef={panelData.tabsContainerRef as React.RefObject<HTMLDivElement>}
          canScrollLeft={panelData.canScrollLeft}
          canScrollRight={panelData.canScrollRight}
          scrollTabsLeft={panelData.scrollTabsLeft}
          scrollTabsRight={panelData.scrollTabsRight}
          sectionsToRender={sectionsToRender}
          resourcesToRender={resourcesToRender}
          selectedIds={panelData.selectedIds}
          listHeight={listHeight}
          listContainerRef={listContainerRef as React.RefObject<HTMLDivElement>}
        />
      </div>
    </>
  );
}
