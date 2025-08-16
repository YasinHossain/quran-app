'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useTranslationPanel } from './useTranslationPanel';
import { ResourceTabs, ResourceList, ResourceItem } from '@/app/shared/resource-panel';
import { TranslationSearch } from './TranslationSearch';
import { TranslationSelectionList } from './TranslationSelectionList';

interface TranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    translations,
    loading,
    error,
    languages,
    groupedTranslations,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    selectedIds,
    handleSelectionToggle,
    orderedSelection,
    handleReset,
    draggedId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  } = useTranslationPanel(isOpen);

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

  const resourcesToRender =
    activeFilter === 'All' ? translations : groupedTranslations[activeFilter] || [];

  // Create sections for rendering with headers, ordered as English, Bengali, then alphabetical
  const sectionsToRender =
    activeFilter === 'All'
      ? Object.entries(groupedTranslations)
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
          .map(([language, items]) => ({
            language,
            items,
          }))
      : [{ language: activeFilter, items: resourcesToRender }];

  return (
    <div
      data-testid="translation-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${theme === 'dark' ? 'bg-[var(--background)] text-[var(--foreground)]' : 'bg-white text-slate-800'}`}
    >
      <header
        className={`flex items-center p-4 border-b ${
          theme === 'dark' ? 'border-[var(--border-color)]' : 'border-slate-200'
        }`}
      >
        <button
          onClick={onClose}
          className={`p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-600'}`}
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
            theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-800'
          }`}
        >
          Manage Translations
        </h2>
        <button
          onClick={handleReset}
          className={`p-2 rounded-full focus-visible:outline-none transition-colors ${
            theme === 'dark'
              ? 'text-[var(--foreground)] hover:bg-gray-700'
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
            {/* Scrollable Content - Search, Selections, Tabs, and List */}
            <div className="flex-1 overflow-y-auto" ref={listContainerRef}>
              <div className="p-4 space-y-4">
                <TranslationSearch
                  theme={theme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <TranslationSelectionList
                  theme={theme}
                  orderedSelection={orderedSelection}
                  translations={translations}
                  handleSelectionToggle={handleSelectionToggle}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleDragEnd={handleDragEnd}
                  draggedId={draggedId}
                />
              </div>

              {/* Sticky Tabs - Will stick to top when scrolled to */}
              <div
                className={`sticky top-0 z-10 py-2 border-b ${
                  theme === 'dark'
                    ? 'bg-[var(--background)] border-[var(--border-color)]'
                    : 'bg-white/95 backdrop-blur-sm border-slate-200'
                }`}
              >
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
                    theme={theme}
                    className=""
                  />
                </div>
              </div>

              <div className="px-4 pb-4 pt-4">
                {activeFilter === 'All' ? (
                  <div className="space-y-6">
                    {sectionsToRender.map(({ language, items }) => (
                      <div key={language}>
                        <h3
                          className={`text-lg font-semibold mb-4 ${
                            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {language}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <ResourceItem
                              key={item.id}
                              item={item}
                              isSelected={selectedIds.has(item.id)}
                              onToggle={handleSelectionToggle}
                              theme={theme}
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
                    theme={theme}
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
