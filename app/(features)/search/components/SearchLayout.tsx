'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSidebar } from '@/app/providers/SidebarContext';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';

import { SearchLeftSidebar, SearchWorkspaceNavigation } from './SearchLeftSidebar';

import type { VerseWithHighlight } from '@/app/(features)/search/hooks/usePaginatedSearch';
import type { ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface SearchLayoutProps {
  children: ReactNode;
  query: string;
  verses: VerseWithHighlight[];
  totalResults: number;
  isLoading: boolean;
  rightSidebar?: React.ReactNode;
}

// ============================================================================
// Mobile Left Sidebar (for smaller screens)
// ============================================================================

interface SearchMobileSidebarProps {
  query: string;
  verses: VerseWithHighlight[];
  totalResults: number;
  isLoading: boolean;
}

const SearchMobileSidebar = ({
  query,
  verses,
  totalResults,
  isLoading,
}: SearchMobileSidebarProps): React.JSX.Element => {
  const { isSearchSidebarOpen, setSearchSidebarOpen } = useSidebar();
  const { t } = useTranslation();

  return (
    <BaseSidebar
      isOpen={isSearchSidebarOpen}
      onClose={() => setSearchSidebarOpen(false)}
      position="left"
      desktopBreakpoint="xl"
      aria-label={t('search_navigation_aria')}
    >
      <SearchLeftSidebar
        query={query}
        verses={verses}
        totalResults={totalResults}
        isLoading={isLoading}
        onClose={() => setSearchSidebarOpen(false)}
      />
    </BaseSidebar>
  );
};

// ============================================================================
// Main Layout Component
// ============================================================================

export const SearchLayout = ({
  children,
  query,
  verses,
  totalResults,
  isLoading,
  rightSidebar,
}: SearchLayoutProps): React.JSX.Element => {
  return (
    <>
      {/* Mobile left sidebar - shown on smaller screens when triggered */}
      <div className="xl:hidden">
        <SearchMobileSidebar
          query={query}
          verses={verses}
          totalResults={totalResults}
          isLoading={isLoading}
        />
      </div>

      <ThreeColumnWorkspace
        left={
          <SearchWorkspaceNavigation
            query={query}
            verses={verses}
            totalResults={totalResults}
            isLoading={isLoading}
          />
        }
        center={
          <WorkspaceMain
            data-slot="search-results-main"
            contentClassName="pb-12 px-4 sm:px-6 xl:px-8"
            className="bg-background"
          >
            {children}
          </WorkspaceMain>
        }
        right={rightSidebar}
      />
    </>
  );
};
