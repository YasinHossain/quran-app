'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResourceTabsProps {
  languages: string[];
  activeFilter: string;
  onTabClick: (lang: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
  theme: string;
  className?: string;
}

export const ResourceTabs: React.FC<ResourceTabsProps> = ({
  languages,
  activeFilter,
  onTabClick,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
  theme,
  className = '',
}) => (
  <div className={`flex items-center overflow-hidden ${className}`}>
    <button
      onClick={scrollTabsLeft}
      disabled={!canScrollLeft}
      className={`p-1 rounded-full mr-2 transition-colors ${
        canScrollLeft
          ? theme === 'dark'
            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
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
      className="flex items-center space-x-2 overflow-hidden flex-1"
    >
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onTabClick(lang)}
          className={`flex-shrink-0 px-3 py-1 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center ${
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
            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          : theme === 'dark'
            ? 'text-slate-600 cursor-not-allowed'
            : 'text-slate-300 cursor-not-allowed'
      }`}
    >
      <ChevronRight size={20} />
    </button>
  </div>
);

export default ResourceTabs;
