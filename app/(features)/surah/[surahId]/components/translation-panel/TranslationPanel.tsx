'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, X, GripVertical, RotateCcw } from 'lucide-react';
import { useTranslationPanel } from './useTranslationPanel';
import { ResourceTabs, ResourceList } from '@/app/shared/resource-panel';

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
    resetSelection,
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

  const resourcesToRender =
    activeFilter === 'All' ? translations : groupedTranslations[activeFilter] || [];

  return (
    <div
      data-testid="translation-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}
    >
      <div
        className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        <h2 className="text-lg font-bold">Translations</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search translations"
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400'
                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>
        {orderedSelection.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {orderedSelection.map((id) => {
              const item = translations.find((t) => t.id === id);
              if (!item) return null;
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, id)}
                  onDragEnd={handleDragEnd}
                  className={`px-2 py-1 rounded-md text-sm flex items-center space-x-1 border cursor-move ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-slate-200'
                      : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <GripVertical size={12} />
                  <span className="truncate max-w-[120px]">{item.name}</span>
                </div>
              );
            })}
            <button
              onClick={resetSelection}
              className={`ml-auto flex items-center space-x-1 text-sm px-2 py-1 rounded-md border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      <div className="sticky top-0 z-10">
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
          className={`border-b ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
          }`}
        />
      </div>

      <div className="flex-1 px-4 pb-4" ref={listContainerRef}>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ResourceList
            resources={resourcesToRender}
            rowHeight={60}
            selectedIds={selectedIds}
            onToggle={handleSelectionToggle}
            theme={theme}
            height={listHeight}
          />
        )}
      </div>
    </div>
  );
};
