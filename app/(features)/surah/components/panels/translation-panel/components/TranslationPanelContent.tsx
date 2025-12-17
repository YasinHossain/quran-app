'use client';

import React from 'react';

import {
  ResourcePanelErrorMessage,
  ResourcePanelLoadingSpinner,
} from '@/app/shared/resource-panel/components/ResourcePanelFallbacks';

import { PanelContentBody } from './TranslationPanelContentBody';

import type { TranslationResource } from '@/types';

interface TranslationPanelContentProps {
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderedSelection: number[];
  translations: TranslationResource[];
  handleSelectionToggle: (id: number) => void;
  onReorder: (ids: number[]) => void;
  languages: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
  sectionsToRender: Array<{ language: string; items: TranslationResource[] }>;
  resourcesToRender: TranslationResource[];
  selectedIds: Set<number>;
  listHeight: number;
  listContainerRef: React.RefObject<HTMLDivElement>;
}

export const TranslationPanelContent = (props: TranslationPanelContentProps): React.JSX.Element => {
  if (props.loading) return <ResourcePanelLoadingSpinner />;
  if (props.error) return <ResourcePanelErrorMessage error={props.error} />;
  return <TranslationPanelContentBodyWrapper {...props} />;
};

function TranslationPanelContentBodyWrapper(
  props: TranslationPanelContentProps
): React.JSX.Element {
  const handleSelection = (id: number): void => props.handleSelectionToggle(id);
  return (
    <PanelContentBody
      searchTerm={props.searchTerm}
      setSearchTerm={props.setSearchTerm}
      orderedSelection={props.orderedSelection}
      translations={props.translations}
      handleSelection={handleSelection}
      onReorder={props.onReorder}
      languages={props.languages}
      activeFilter={props.activeFilter}
      setActiveFilter={props.setActiveFilter}
      tabsContainerRef={props.tabsContainerRef}
      canScrollLeft={props.canScrollLeft}
      canScrollRight={props.canScrollRight}
      scrollTabsLeft={props.scrollTabsLeft}
      scrollTabsRight={props.scrollTabsRight}
      sectionsToRender={props.sectionsToRender}
      resourcesToRender={props.resourcesToRender}
      selectedIds={props.selectedIds}
      listHeight={props.listHeight}
      listContainerRef={props.listContainerRef}
    />
  );
}
