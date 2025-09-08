'use client';

import React from 'react';

import { ResourcePanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';
import { useListHeight } from '@/app/shared/resource-panel/hooks/useListHeight';
import {
  useTafsirPanel,
  type UseTafsirPanelReturn,
} from '@/src/presentation/hooks/useTafsirPanel';

import { TafsirPanelContent } from './components/TafsirPanelContent';
import { useTafsirSections } from './hooks/useTafsirSections';

import type { TafsirResource } from '@/types';

function createTafsirContentProps(
  panelData: UseTafsirPanelReturn,
  resourcesToRender: TafsirResource[],
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
    handleDragStart: panelData.handleDragStart,
    handleDragOver: panelData.handleDragOver,
    handleDrop: panelData.handleDrop,
    handleDragEnd: panelData.handleDragEnd,
    draggedId: panelData.draggedId,
    languages: panelData.languages,
    activeFilter: panelData.activeFilter,
    setActiveFilter: panelData.setActiveFilter,
    tabsContainerRef: panelData.tabsContainerRef as React.RefObject<HTMLDivElement>,
    canScrollLeft: panelData.canScrollLeft,
    canScrollRight: panelData.canScrollRight,
    scrollTabsLeft: panelData.scrollTabsLeft,
    scrollTabsRight: panelData.scrollTabsRight,
    resourcesToRender,
    selectedIds: panelData.selectedIds,
    listHeight,
    listContainerRef: listContainerRef as React.RefObject<HTMLDivElement>,
  };
}

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirPanel = ({ isOpen, onClose }: TafsirPanelProps): React.JSX.Element => {
  const panelData = useTafsirPanel(isOpen);
  const { listContainerRef, listHeight } = useListHeight(isOpen);
  const { resourcesToRender } = useTafsirSections(
    panelData.activeFilter,
    panelData.tafsirs,
    panelData.groupedTafsirs
  );

  const contentProps = createTafsirContentProps(
    panelData,
    resourcesToRender,
    listHeight,
    listContainerRef
  );

  return (
    <div
      data-testid="tafsir-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-background text-foreground`}
    >
      <ResourcePanelHeader
        title="Manage Tafsirs"
        onClose={onClose}
        onReset={panelData.handleReset}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <TafsirPanelContent {...contentProps} />
      </div>
    </div>
  );
};
