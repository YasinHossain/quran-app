'use client';

import React from 'react';

import { AlertIcon } from '@/app/shared/icons';

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
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
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

function LoadingView(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
    </div>
  );
}

function ErrorView({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="mx-4 mt-4 p-4 rounded-lg border bg-error/10 border-error/20 text-error">
      <div className="flex items-center space-x-2">
        <AlertIcon className="h-5 w-5 text-error" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

export const TranslationPanelContent = (props: TranslationPanelContentProps): React.JSX.Element => {
  if (props.loading) return <LoadingView />;
  if (props.error) return <ErrorView message={props.error} />;
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
      handleDragStart={props.handleDragStart}
      handleDragOver={props.handleDragOver}
      handleDrop={props.handleDrop}
      handleDragEnd={props.handleDragEnd}
      draggedId={props.draggedId}
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
