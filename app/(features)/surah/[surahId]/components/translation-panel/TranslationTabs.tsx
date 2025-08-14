import React from 'react';

interface TranslationTabsProps {
  languages: string[];
  activeFilter: string;
  onTabClick: (lang: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
  theme: string;
}

export const TranslationTabs: React.FC<TranslationTabsProps> = ({
  languages,
  activeFilter,
  onTabClick,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
  theme,
}) => (
  <div className="sticky top-0 z-10">
    <div
      className={`flex items-center overflow-hidden border-b ${
        theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
      }`}
    >
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
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <div
        ref={tabsContainerRef}
        className="flex items-center space-x-2 overflow-x-auto flex-1 scrollbar-hide"
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
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            : theme === 'dark'
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 cursor-not-allowed'
        }`}
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        </svg>
      </button>
    </div>
  </div>
);
