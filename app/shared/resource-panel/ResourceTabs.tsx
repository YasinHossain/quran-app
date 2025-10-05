'use client';
import React from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@/app/shared/icons';

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

function NavButton({
  disabled,
  onClick,
  children,
  side,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
  side: 'left' | 'right';
}): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1 rounded-full ${side === 'left' ? 'mr-2' : 'ml-2'} transition-colors ${
        disabled
          ? 'text-muted cursor-not-allowed'
          : 'text-muted hover:text-foreground hover:bg-interactive-hover'
      }`}
    >
      {children}
    </button>
  );
}

function Tab({
  lang,
  active,
  onClick,
}: {
  lang: string;
  active: boolean;
  onClick: (lang: string) => void;
}): React.JSX.Element {
  return (
    <button
      key={lang}
      onClick={() => onClick(lang)}
      className={`flex-shrink-0 px-3 py-1 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center ${
        active
          ? 'border-accent text-accent'
          : 'border-transparent text-muted hover:text-foreground hover:border-border'
      }`}
    >
      {lang}
    </button>
  );
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
}: ResourceTabsProps): React.JSX.Element => (
  <div className={`flex items-center overflow-hidden ${className}`}>
    <NavButton disabled={!canScrollLeft} onClick={scrollTabsLeft} side="left">
      <ChevronLeftIcon size={20} />
    </NavButton>
    <div ref={tabsContainerRef} className="flex items-center space-x-2 overflow-hidden flex-1">
      {languages.map((lang) => (
        <Tab key={lang} lang={lang} active={activeFilter === lang} onClick={onTabClick} />
      ))}
    </div>
    <NavButton disabled={!canScrollRight} onClick={scrollTabsRight} side="right">
      <ChevronRightIcon size={20} />
    </NavButton>
  </div>
);
