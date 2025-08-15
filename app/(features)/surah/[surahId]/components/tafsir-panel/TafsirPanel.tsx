'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { ResourceTabs, ResourceList } from '@/app/shared/resource-panel';
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
    handleTabClick,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
    stickyHeaderRef,
    tabsContainerRef,
    handleReset,
  } = useTafsirPanel(isOpen);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const element = listContainerRef.current;
    if (!element) return;

    const updateHeight = () => setListHeight(element.getBoundingClientRect().height);
    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setListHeight(entry.contentRect.height);
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const resourcesToRender = activeFilter === 'All' ? tafsirs : groupedTafsirs[activeFilter] || [];

  return (
    <div
      data-testid="tafsir-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}
    >
      <TafsirLimitWarning show={showLimitWarning} theme={theme} />

      <header
        className={`flex items-center p-4 border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        <button
          onClick={onClose}
          className={`p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-200'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2
          className={`text-lg font-bold text-center flex-grow ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          Manage Tafsirs
        </h2>
        <button
          onClick={handleReset}
          className={`p-2 rounded-full focus:outline-none transition-colors ${
            theme === 'dark'
              ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }`}
          title="Reset to Default"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                theme === 'dark' ? 'border-slate-400' : 'border-slate-600'
              }`}
            />
          </div>
        )}

        {error && (
          <div
            className={`mx-4 mt-4 p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-red-900/20 border-red-700 text-red-200'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="p-4 space-y-4">
              <TafsirSearch theme={theme} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <TafsirSelectionList
                theme={theme}
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

            <div
              ref={stickyHeaderRef}
              className={`sticky top-0 z-10 backdrop-blur-sm pt-2 pb-0 border-b ${
                theme === 'dark'
                  ? 'bg-slate-900/95 border-slate-700'
                  : 'bg-white/95 border-slate-200'
              }`}
            >
              <div className="px-4">
                <ResourceTabs
                  languages={languages}
                  activeFilter={activeFilter}
                  onTabClick={handleTabClick}
                  tabsContainerRef={tabsContainerRef}
                  canScrollLeft={canScrollLeft}
                  canScrollRight={canScrollRight}
                  scrollTabsLeft={scrollTabsLeft}
                  scrollTabsRight={scrollTabsRight}
                  theme={theme}
                  className="pb-2"
                />
              </div>
            </div>

            <div className="px-4 pb-4 flex-1" ref={listContainerRef}>
              <div className="mt-4">
                <ResourceList
                  resources={resourcesToRender}
                  rowHeight={60}
                  selectedIds={selectedIds}
                  onToggle={handleSelectionToggle}
                  theme={theme}
                  height={listHeight}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
