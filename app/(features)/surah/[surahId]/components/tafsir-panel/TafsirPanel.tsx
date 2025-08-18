'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { ResourceTabs, ResourceList, ResourceItem } from '@/app/shared/resource-panel';
import { useTafsirPanel } from './useTafsirPanel';
import { TafsirSearch } from './TafsirSearch';
import { TafsirSelectionList } from './TafsirSelectionList';
import { TafsirLimitWarning } from './TafsirLimitWarning';

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirPanel: React.FC<TafsirPanelProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    tafsirs,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    languages,
    groupedTafsirs,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    showLimitWarning,
    activeFilter,
    setActiveFilter,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
    tabsContainerRef,
    handleReset,
  } = useTafsirPanel(isOpen);

  // Dynamic list container height for virtualized list sizing
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const element = listContainerRef.current;
    if (!element || !isOpen) return;

    const updateHeight = () => {
      const rect = element.getBoundingClientRect();
      const fallback = window.innerHeight - rect.top;
      setListHeight(rect.height || fallback);
    };

    updateHeight();

    const ResizeObserverConstructor =
      typeof ResizeObserver !== 'undefined' ? ResizeObserver : ResizeObserverPolyfill;

    if (ResizeObserverConstructor) {
      const observer = new ResizeObserverConstructor((entries) => {
        for (const entry of entries) {
          const rect = entry.target.getBoundingClientRect();
          const fallback = window.innerHeight - rect.top;
          setListHeight(entry.contentRect.height || fallback);
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isOpen]);

  const resourcesToRender = activeFilter === 'All' ? tafsirs : groupedTafsirs[activeFilter] || [];

  return (
    <div
      data-testid="tafsir-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-surface text-primary`}
    >
      <TafsirLimitWarning show={showLimitWarning} />

      <header className="flex items-center p-4 border-b border-border">
        <button
          onClick={onClose}
          className="p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-hover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-center flex-grow text-primary">Manage Tafsirs</h2>
        <button
          onClick={handleReset}
          className="p-2 rounded-full focus-visible:outline-none transition-colors text-muted hover:bg-hover hover:text-primary"
          title="Reset to Default"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-border" />
          </div>
        )}

        {error && (
          <div className="mx-4 mt-4 p-4 rounded-lg border bg-red-900/20 border-red-700 text-red-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Scrollable Content - Search, Selections, Tabs, and List */}
            <div className="flex-1 overflow-y-auto" ref={listContainerRef}>
              <div className="p-4 space-y-4">
                <TafsirSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <TafsirSelectionList
                  orderedSelection={orderedSelection}
                  tafsirs={tafsirs}
                  handleSelectionToggle={handleSelectionToggle}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleDragEnd={handleDragEnd}
                  draggedId={draggedId}
                />
              </div>

              {/* Sticky Tabs - Will stick to top when scrolled to */}
              <div className="sticky top-0 z-10 py-2 border-b bg-surface/95 backdrop-blur-sm border-border">
                <div className="px-4">
                  <ResourceTabs
                    languages={languages}
                    activeFilter={activeFilter}
                    onTabClick={setActiveFilter}
                    tabsContainerRef={tabsContainerRef}
                    canScrollLeft={canScrollLeft}
                    canScrollRight={canScrollRight}
                    scrollTabsLeft={scrollTabsLeft}
                    scrollTabsRight={scrollTabsRight}
                    className=""
                  />
                </div>
              </div>

              <div className="px-4 pb-4 pt-4">
                {activeFilter === 'All' ? (
                  <div className="space-y-6">
                    {Object.entries(groupedTafsirs)
                      .sort(([langA], [langB]) => {
                        // English first
                        if (langA === 'English') return -1;
                        if (langB === 'English') return 1;
                        // Bengali second
                        if (langA === 'Bengali') return -1;
                        if (langB === 'Bengali') return 1;
                        // Then alphabetical
                        return langA.localeCompare(langB);
                      })
                      .map(([language, items]) => (
                        <div key={language}>
                          <h3 className="text-lg font-semibold mb-4 text-primary">{language}</h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <ResourceItem
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.has(item.id)}
                                onToggle={handleSelectionToggle}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <ResourceList
                    resources={resourcesToRender}
                    rowHeight={58}
                    selectedIds={selectedIds}
                    onToggle={handleSelectionToggle}
                    height={listHeight}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
