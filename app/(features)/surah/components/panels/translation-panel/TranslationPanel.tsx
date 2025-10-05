'use client';

import React from 'react';

import { useListHeight } from '@/app/shared/resource-panel/hooks/useListHeight';

import { TranslationPanelContent } from './components/TranslationPanelContent';
import { TranslationPanelHeader } from './components/TranslationPanelHeader';
import { useTranslationSections } from './hooks/useTranslationSections';
import { useTranslationPanel } from './useTranslationPanel';

interface TranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslationPanel = ({ isOpen, onClose }: TranslationPanelProps): React.JSX.Element => {
  const panelData = useTranslationPanel();
  const { listContainerRef, listHeight } = useListHeight(isOpen);
  const { resourcesToRender, sectionsToRender } = useTranslationSections(
    panelData.activeFilter,
    panelData.translations,
    panelData.groupedTranslations
  );

  return (
    <div
      data-testid="translation-panel"
      aria-hidden={!isOpen}
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-background text-foreground`}
    >
      <TranslationPanelHeader onClose={onClose} onReset={panelData.handleReset} />

      <div className="flex-1 flex flex-col min-h-0">
        <TranslationPanelContent
          loading={panelData.loading}
          error={panelData.error}
          searchTerm={panelData.searchTerm}
          setSearchTerm={panelData.setSearchTerm}
          orderedSelection={panelData.orderedSelection}
          translations={panelData.translations}
          handleSelectionToggle={panelData.handleSelectionToggle}
          handleDragStart={panelData.handleDragStart}
          handleDragOver={panelData.handleDragOver}
          handleDrop={panelData.handleDrop}
          handleDragEnd={panelData.handleDragEnd}
          draggedId={panelData.draggedId}
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
    </div>
  );
};
