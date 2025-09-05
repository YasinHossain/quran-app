'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SettingsSidebar } from '@/app/(features)/surah/components';
import { useSidebar } from '@/app/providers/SidebarContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useBookmarkFolderData, useBookmarkFolderPanels } from './hooks';
import { BookmarkFolderSidebar } from '../components/BookmarkFolderSidebar';
import { BookmarkVerseList } from '../components/BookmarkVerseList';
import { FolderNotFound } from './components/FolderNotFound';

interface BookmarkFolderClientProps {
  folderId: string;
}

interface BreadcrumbNavigationProps {
  onNavigateToBookmarks: () => void;
  folderName: string;
  activeVerseId?: string;
  verses: any[];
}

const BreadcrumbNavigation = ({
  onNavigateToBookmarks,
  folderName,
  activeVerseId,
  verses,
}: BreadcrumbNavigationProps): React.JSX.Element => (
  <nav className="flex items-center space-x-2 text-sm mb-6 hidden lg:flex" aria-label="Breadcrumb">
    <button
      onClick={onNavigateToBookmarks}
      className="text-accent hover:text-accent-hover transition-colors"
    >
      Bookmarks
    </button>
    <span className="text-muted">/</span>
    <span className="text-foreground font-medium">{folderName}</span>
    {activeVerseId && (
      <>
        <span className="text-muted">/</span>
        <span className="text-muted">
          {(() => {
            const verse = verses.find((v) => String(v.id) === activeVerseId);
            return verse ? verse.verse_key : 'Verse';
          })()}
        </span>
      </>
    )}
  </nav>
);

interface MainContentProps {
  isHidden: boolean;
  folderName: string;
  activeVerseId?: string;
  verses: any[];
  displayVerses: any[];
  loadingVerses: Set<any>;
  onNavigateToBookmarks: () => void;
}

const MainContent = ({
  isHidden,
  folderName,
  activeVerseId,
  verses,
  displayVerses,
  loadingVerses,
  onNavigateToBookmarks,
}: MainContentProps): React.JSX.Element => (
  <main className="h-screen text-foreground font-sans lg:ml-[20.7rem] overflow-hidden relative">
    <div
      className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
        isHidden ? 'pt-12 lg:pt-4' : 'pt-24 lg:pt-20'
      }`}
    >
      <div>
        <BreadcrumbNavigation
          onNavigateToBookmarks={onNavigateToBookmarks}
          folderName={folderName}
          activeVerseId={activeVerseId}
          verses={verses}
        />
        <BookmarkVerseList
          verses={displayVerses}
          isLoading={loadingVerses.size > 0 && verses.length === 0}
          error={null}
        />
      </div>
    </div>
  </main>
);

/**
 * Client component for displaying bookmark folder contents with sidebar navigation.
 * Handles folder data loading, verse display, and panel management.
 */
export function BookmarkFolderClient({ folderId }: BookmarkFolderClientProps): React.JSX.Element {
  logger.debug('BookmarkFolderClient rendering', { folderId });
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const [activeVerseId, setActiveVerseId] = useState<string | undefined>(undefined);
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  const { folder, bookmarks, verses, loadingVerses } = useBookmarkFolderData({ folderId });
  const {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } = useBookmarkFolderPanels();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const displayVerses = useMemo(() => {
    if (!verses.length) return [];

    let filteredVerses = verses;

    // Apply verse selection filter
    if (activeVerseId) {
      filteredVerses = filteredVerses.filter((v) => String(v.id) === activeVerseId);
    }

    return filteredVerses;
  }, [verses, activeVerseId]);

  if (!folder) {
    return <FolderNotFound />;
  }

  const handleVerseSelect = (verseId: string): void => {
    setActiveVerseId(verseId === activeVerseId ? undefined : verseId);
    setBookmarkSidebarOpen(false);
  };

  const handleNavigateToBookmarks = (): void => {
    router.push('/bookmarks');
  };

  return (
    <>
      <BookmarkFolderSidebar
        bookmarks={bookmarks}
        folder={folder}
        {...(activeVerseId && { activeVerseId })}
        onVerseSelect={handleVerseSelect}
        onBack={handleNavigateToBookmarks}
        isOpen={isBookmarkSidebarOpen}
        onClose={() => setBookmarkSidebarOpen(false)}
      />

      <MainContent
        isHidden={isHidden}
        folderName={folder.name}
        activeVerseId={activeVerseId}
        verses={verses}
        displayVerses={displayVerses}
        loadingVerses={loadingVerses}
        onNavigateToBookmarks={handleNavigateToBookmarks}
      />

      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        onWordLanguagePanelOpen={() => setIsWordPanelOpen(true)}
        onReadingPanelOpen={() => {}}
        selectedTranslationName={selectedTranslationName}
        selectedWordLanguageName={selectedWordLanguageName}
        isTranslationPanelOpen={isTranslationPanelOpen}
        onTranslationPanelClose={() => setIsTranslationPanelOpen(false)}
        isWordLanguagePanelOpen={isWordPanelOpen}
        onWordLanguagePanelClose={() => setIsWordPanelOpen(false)}
      />
    </>
  );
}
