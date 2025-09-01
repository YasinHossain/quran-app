'use client';

// DEPRECATED: This hook is kept for backward compatibility only.
// New implementations should use @/src/presentation/hooks/useTafsirPanel
// which follows clean architecture principles.

import { useTafsirPanel as useCleanTafsirPanel } from '@/src/presentation/hooks/useTafsirPanel';

/**
 * DEPRECATED: Legacy hook kept for backward compatibility
 * 
 * This hook delegates to the new clean architecture implementation
 * while maintaining the same interface to prevent breaking changes.
 * 
 * @param isOpen - Whether the panel is open
 * @returns Panel data and handlers
 */
export const useTafsirPanel = (isOpen: boolean) => {
  // Delegate to the clean architecture implementation
  const result = useCleanTafsirPanel(isOpen);
  
  // Return the same interface as before for backward compatibility
  return {
    theme: result.theme,
    tafsirs: result.tafsirs,
    loading: result.loading,
    error: result.error,
    searchTerm: result.searchTerm,
    setSearchTerm: result.setSearchTerm,
    languages: result.languages,
    groupedTafsirs: result.groupedTafsirs,
    selectedIds: result.selectedIds,
    orderedSelection: result.orderedSelection,
    handleSelectionToggle: result.handleSelectionToggle,
    handleDragStart: result.handleDragStart,
    handleDragOver: result.handleDragOver,
    handleDrop: result.handleDrop,
    handleDragEnd: result.handleDragEnd,
    draggedId: result.draggedId,
    showLimitWarning: result.showLimitWarning,
    activeFilter: result.activeFilter,
    setActiveFilter: result.setActiveFilter,
    tabsContainerRef: result.tabsContainerRef,
    canScrollLeft: result.canScrollLeft,
    canScrollRight: result.canScrollRight,
    scrollTabsLeft: result.scrollTabsLeft,
    scrollTabsRight: result.scrollTabsRight,
    handleReset: result.handleReset,
  };
};
