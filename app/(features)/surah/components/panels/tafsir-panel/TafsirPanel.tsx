'use client';

import React from 'react';

import { SlideOverPanel } from '@/app/shared/components/SlideOverPanel';
import { SettingsPanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';
import { useListHeight } from '@/app/shared/resource-panel/hooks/useListHeight';
import { useTafsirPanel, type UseTafsirPanelReturn } from '@/src/presentation/hooks/useTafsirPanel';

import { TafsirPanelContent } from './components/TafsirPanelContent';
import { useTafsirSections } from './hooks/useTafsirSections';

import type { TafsirResource } from '@/types';

function createTafsirContentProps(
  panelData: UseTafsirPanelReturn,
  resourcesToRender: TafsirResource[],
  sectionsToRender: Array<{ language: string; items: TafsirResource[] }>,
  listHeight: number,
  listContainerRef: React.RefObject<HTMLDivElement | null>
): React.ComponentProps<typeof TafsirPanelContent> {
  return {
    loading: panelData.loading,
    error: panelData.error,
    showLimitWarning: panelData.showLimitWarning,
    searchTerm: panelData.searchTerm,
    setSearchTerm: panelData.setSearchTerm,
    orderedSelection: panelData.orderedSelection,
    tafsirs: panelData.tafsirs,
    handleSelectionToggle: panelData.handleSelectionToggle,
    languages: panelData.languages,
    activeFilter: panelData.activeFilter,
    setActiveFilter: panelData.setActiveFilter,
    tabsContainerRef: panelData.tabsContainerRef as React.RefObject<HTMLDivElement>,
    canScrollLeft: panelData.canScrollLeft,
    canScrollRight: panelData.canScrollRight,
    scrollTabsLeft: panelData.scrollTabsLeft,
    scrollTabsRight: panelData.scrollTabsRight,
    resourcesToRender,
    sectionsToRender,
    selectedIds: panelData.selectedIds,
    listHeight,
    listContainerRef: listContainerRef as React.RefObject<HTMLDivElement>,
    onReorder: panelData.setSelections,
    onReset: panelData.handleReset,
  };
}

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseSidebar?: () => void;
}

export const TafsirPanel = ({
  isOpen,
  onClose,
  onCloseSidebar,
}: TafsirPanelProps): React.JSX.Element => {
  const panelData = useTafsirPanel(isOpen);
  const { listContainerRef, listHeight } = useListHeight(isOpen);
  const { resourcesToRender, sectionsToRender } = useTafsirSections(
    panelData.activeFilter,
    panelData.tafsirs,
    panelData.groupedTafsirs,
    panelData.languages
  );

  const contentProps = createTafsirContentProps(
    panelData,
    resourcesToRender,
    sectionsToRender,
    listHeight,
    listContainerRef
  );

  return (
    <SlideOverPanel isOpen={isOpen} testId="tafsir-panel">
      <SettingsPanelHeader
        title="Manage Tafsirs"
        onClose={onClose}
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <TafsirPanelContent {...contentProps} />
      </div>
    </SlideOverPanel>
  );
};
