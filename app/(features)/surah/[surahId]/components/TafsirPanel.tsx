'use client';

import React from 'react';
import { Search, GripVertical, X, AlertCircle, RotateCcw } from 'lucide-react';
import { useTafsirPanel } from './tafsir-panel/useTafsirPanel';
import { ResourceTabs, ResourceList } from '@/app/shared/resource-panel';
import { MAX_SELECTIONS } from './tafsir-panel/tafsirPanel.utils';

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

  return (
    <div
      data-testid="tafsir-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}
    >
      {showLimitWarning && (
        <div
          className={`absolute top-16 left-4 right-4 p-3 rounded-lg z-20 flex items-center space-x-2 ${
            theme === 'dark' ? 'bg-red-900/90 border-red-700' : 'bg-red-50 border-red-200'
          } border`}
        >
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>
            Maximum {MAX_SELECTIONS} tafsirs can be selected
          </span>
        </div>
      )}

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

      <div className="flex-1 overflow-y-auto min-h-0">
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
              <div className="relative">
                <Search
                  className={`h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search tafsirs (exact match)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition border ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <h2
                  className={`text-sm font-semibold px-1 mb-2 flex items-center justify-between ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <span>
                    MY SELECTIONS ({orderedSelection.length}/{MAX_SELECTIONS})
                  </span>
                  {orderedSelection.length >= MAX_SELECTIONS && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      MAX
                    </span>
                  )}
                </h2>
                <div
                  className={`space-y-2 min-h-[40px] rounded-lg p-2 ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700'
                      : 'bg-white border-slate-200'
                  } border`}
                >
                  {orderedSelection.length === 0 ? (
                    <p
                      className={`text-center text-sm py-2 ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      No tafsirs selected
                    </p>
                  ) : (
                    orderedSelection.map((id) => {
                      const item = tafsirs.find((t) => t.id === id);
                      if (!item) return null;
                      return (
                        <div
                          key={id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, id)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center justify-between p-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-opacity border ${
                            draggedId === id ? 'opacity-50' : 'opacity-100'
                          } ${
                            theme === 'dark'
                              ? 'bg-slate-700/50 border-slate-700'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center min-w-0">
                            <GripVertical
                              className={`h-5 w-5 mr-2 flex-shrink-0 ${
                                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            />
                            <span
                              className={`font-medium text-sm truncate ${
                                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <button
                            onClick={() => handleSelectionToggle(id)}
                            className={`hover:text-red-500 transition-colors p-1 rounded-full flex-shrink-0 ml-2 ${
                              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
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

            <div className="px-4 pb-4">
              <div className="mt-4">
                <ResourceList
                  activeFilter={activeFilter}
                  languages={languages}
                  groupedResources={groupedTafsirs}
                  selectedIds={selectedIds}
                  onToggle={handleSelectionToggle}
                  theme={theme}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
