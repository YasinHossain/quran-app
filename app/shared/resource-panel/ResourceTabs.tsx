'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@/app/shared/icons';

import type React from 'react';

interface ResourceTabsProps {
  languages: string[];
  activeFilter: string;
  onTabClick: (lang: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
  className?: string;
}

export const ResourceTabs = ({
  languages,
  activeFilter,
  onTabClick,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
  className = '',
}: ResourceTabsProps): JSX.Element => (
  <div className={`flex items-center overflow-hidden ${className}`}>
    <button
      onClick={scrollTabsLeft}
      disabled={!canScrollLeft}
      className={`p-1 rounded-full mr-2 transition-colors ${
        canScrollLeft
          ? 'text-muted hover:text-foreground hover:bg-interactive-hover'
          : 'text-muted cursor-not-allowed'
      }`}
    >
      <ChevronLeftIcon size={20} />
    </button>
    <div ref={tabsContainerRef} className="flex items-center space-x-2 overflow-hidden flex-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onTabClick(lang)}
          className={`flex-shrink-0 px-3 py-1 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center ${
            activeFilter === lang
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-foreground hover:border-border'
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
          ? 'text-muted hover:text-foreground hover:bg-interactive-hover'
          : 'text-muted cursor-not-allowed'
      }`}
    >
      <ChevronRightIcon size={20} />
    </button>
  </div>
);
