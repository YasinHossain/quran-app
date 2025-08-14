'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TafsirTabsProps {
  languages: string[];
  activeFilter: string;
  theme: string;
  stickyHeaderRef: React.RefObject<HTMLDivElement | null>;
  tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
  onTabClick: (lang: string) => void;
}

export const TafsirTabs: React.FC<TafsirTabsProps> = ({
  languages,
  activeFilter,
  theme,
  stickyHeaderRef,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
  onTabClick,
}) => {
  return (
    <div
      ref={stickyHeaderRef}
      className={`sticky top-0 z-10 backdrop-blur-sm pt-2 pb-0 border-b ${
        theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'
      }`}
    >
      <div className="px-4">
        <div className="flex items-center pb-2">
          <button
            onClick={scrollTabsLeft}
            disabled={!canScrollLeft}
            className={`p-1 rounded-full mr-2 transition-colors ${
              canScrollLeft
                ? theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                : theme === 'dark'
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={tabsContainerRef}
            className="flex items-center space-x-2 overflow-x-hidden flex-1"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => onTabClick(lang)}
                className={`flex-shrink-0 px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
                  activeFilter === lang
                    ? 'border-blue-600 text-blue-600'
                    : `border-transparent ${
                        theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-200 hover:border-slate-600'
                          : 'text-slate-500 hover:text-slate-800 hover:border-slate-300'
                      }`
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={scrollTabsRight}
            disabled={!canScrollRight}
            className={`p-1 rounded-full ml-2 transition-colors ${
              canScrollRight
                ? theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                : theme === 'dark'
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
