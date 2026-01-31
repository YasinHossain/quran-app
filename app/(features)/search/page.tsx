'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useCallback, useState } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useTranslationOptions } from '@/app/(features)/surah/hooks/useTranslationOptions';
import { useSettings } from '@/app/providers/SettingsContext';
import { SettingsSidebar } from '@/app/shared/reader/settings/SettingsSidebar';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';

import { SearchLayout } from './components/SearchLayout';
import { SearchResultsContent } from './components/SearchResultsContent';
import { usePaginatedSearch } from './hooks/usePaginatedSearch';

import type { LanguageCode } from '@/lib/text/languageCodes';

// ============================================================================
// Panel Toggles Hook (similar to bookmarks pattern)
// ============================================================================

function useSearchPanelToggles(): {
  isTranslationPanelOpen: boolean;
  isWordPanelOpen: boolean;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  handleTranslationPanelOpen: () => void;
  handleTranslationPanelClose: () => void;
  handleWordPanelOpen: () => void;
  handleWordPanelClose: () => void;
} {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { translationOptions, wordLanguageOptions } = useTranslationOptions();

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  const selectedTranslationName = useMemo(() => {
    if (settings.translationIds?.length === 0) {
      return t('no_translation_selected');
    }

    return (
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation')
    );
  }, [settings.translationIds, settings.translationId, translationOptions, t]);

  const selectedWordLanguageName = useMemo(
    () =>
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
          settings.wordLang
      )?.name || t('select_word_translation'),
    [settings.wordLang, wordLanguageOptions, t]
  );

  const handleTranslationPanelOpen = useCallback(() => setIsTranslationPanelOpen(true), []);
  const handleTranslationPanelClose = useCallback(() => setIsTranslationPanelOpen(false), []);
  const handleWordPanelOpen = useCallback(() => setIsWordPanelOpen(true), []);
  const handleWordPanelClose = useCallback(() => setIsWordPanelOpen(false), []);

  return {
    isTranslationPanelOpen,
    isWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
    handleTranslationPanelOpen,
    handleTranslationPanelClose,
    handleWordPanelOpen,
    handleWordPanelClose,
  };
}

// ============================================================================
// Search Page Content
// ============================================================================

function SearchPageContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const panel = useSearchPanelToggles();

  const {
    verses,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    totalPages,
    totalResults,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    goToPage,
  } = usePaginatedSearch(query);

  return (
    <>
      {/* Mobile settings sidebar */}
      <div className="2xl:hidden">
        <SettingsSidebar
          pageType="bookmarks"
          readerTabsEnabled={false}
          selectedTranslationName={panel.selectedTranslationName}
          selectedWordLanguageName={panel.selectedWordLanguageName}
          onTranslationPanelOpen={panel.handleTranslationPanelOpen}
          onTranslationPanelClose={panel.handleTranslationPanelClose}
          isTranslationPanelOpen={panel.isTranslationPanelOpen}
          onWordLanguagePanelOpen={panel.handleWordPanelOpen}
          onWordLanguagePanelClose={panel.handleWordPanelClose}
          isWordLanguagePanelOpen={panel.isWordPanelOpen}
        />
      </div>

      <SearchLayout
        query={query}
        verses={verses}
        totalResults={totalResults}
        isLoading={isLoading}
        rightSidebar={
          <SettingsSidebarContent
            readerTabsEnabled={false}
            selectedTranslationName={panel.selectedTranslationName}
            selectedWordLanguageName={panel.selectedWordLanguageName}
            onTranslationPanelOpen={panel.handleTranslationPanelOpen}
            onTranslationPanelClose={panel.handleTranslationPanelClose}
            isTranslationPanelOpen={panel.isTranslationPanelOpen}
            onWordLanguagePanelOpen={panel.handleWordPanelOpen}
            onWordLanguagePanelClose={panel.handleWordPanelClose}
            isWordLanguagePanelOpen={panel.isWordPanelOpen}
          />
        }
      >
        <SearchResultsContent
          query={query}
          verses={verses}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
          onGoToPage={goToPage}
        />
      </SearchLayout>
    </>
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function SearchPageLoading(): React.JSX.Element {
  return (
    <div className="p-6 pt-20 md:pt-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-interactive/50 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-interactive/50 rounded animate-pulse" />
          <div className="h-4 w-60 bg-interactive/30 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-b border-border/60 py-8 animate-pulse">
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="h-10 w-3/4 rounded-md bg-interactive/50" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-32 rounded-md bg-interactive/30" />
                <div className="h-4 w-full rounded-md bg-interactive/40" />
                <div className="h-4 w-5/6 rounded-md bg-interactive/40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Export
// ============================================================================

export default function SearchPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SearchPageLoading />}>
        <SearchPageContent />
      </Suspense>
    </div>
  );
}
