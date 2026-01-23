'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

// Search icon component
export const SearchIcon = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/20 to-muted/5 shadow-sm transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ transitionDelay: '200ms' }}
    >
      <svg className="h-10 w-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

// Search content
interface SearchContentProps {
  searchTerm: string;
}

export const SearchContent = ({ searchTerm }: SearchContentProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
      style={{ transitionDelay: '300ms' }}
    >
      <h3 className="mb-3 text-2xl font-bold text-foreground">
        {t('bookmarks_search_empty_title')}
      </h3>
      <div className="mb-8 space-y-2">
        <p className="text-base text-muted">{t('bookmarks_search_empty_description')}</p>
        <p className="inline-block rounded-xl border border-border bg-surface px-4 py-2 font-mono text-sm text-foreground">
          &quot;{searchTerm}&quot;
        </p>
      </div>
    </div>
  );
};

// Search actions
interface SearchActionsProps {
  onClearSearch: () => void;
}

export const SearchActions = ({ onClearSearch }: SearchActionsProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`space-y-4 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ transitionDelay: '400ms' }}
    >
      <button
        onClick={onClearSearch}
        className="font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md rounded-xl bg-accent px-6 py-3 text-on-accent hover:bg-accent/90"
      >
        {t('bookmarks_search_clear')}
      </button>

      <div className="text-sm text-muted">
        <p>{t('bookmarks_search_empty_tip')}</p>
      </div>
    </div>
  );
};
