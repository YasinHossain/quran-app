'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkFolderSidebar } from '../components/BookmarkFolderSidebar';
import { BookmarkVerseList } from '../components/BookmarkVerseList';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import { SettingsSidebar } from '@/app/(features)/surah/components';
import { useBookmarkFolderData, useBookmarkFolderPanels } from './hooks';
import { FolderNotFound } from './components/FolderNotFound';
import { logger } from '@/src/infrastructure/monitoring/Logger';

interface BookmarkFolderClientProps {
  folderId: string;
}

/**
 * Client component for displaying bookmark folder contents with sidebar navigation.
 * Handles folder data loading, verse display, and panel management.
 */
export function BookmarkFolderClient({
  folderId,
}: BookmarkFolderClientProps): React.JSX.Element {
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

  return (
    <>
      {/* Left Sidebar - navigation */}
      <BookmarkFolderSidebar
        bookmarks={bookmarks}
        folder={folder}
        {...(activeVerseId && { activeVerseId })}
        onVerseSelect={(verseId) => {
          setActiveVerseId(verseId === activeVerseId ? undefined : verseId);
          setBookmarkSidebarOpen(false);
        }}
        onBack={() => router.push('/bookmarks')}
        isOpen={isBookmarkSidebarOpen}
        onClose={() => setBookmarkSidebarOpen(false)}
      />

      {/* Main Content - Verse display */}
      <main className="h-screen text-foreground font-sans lg:ml-[20.7rem] overflow-hidden relative">
        <div
          className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
            isHidden ? 'pt-12 lg:pt-4' : 'pt-24 lg:pt-20'
          }`}
        >
          <div>
            {/* Breadcrumb Navigation */}
            <nav
              className="flex items-center space-x-2 text-sm mb-6 hidden lg:flex"
              aria-label="Breadcrumb"
            >
              <button
                onClick={() => router.push('/bookmarks')}
                className="text-accent hover:text-accent-hover transition-colors"
              >
                Bookmarks
              </button>
              <span className="text-muted">/</span>
              <span className="text-foreground font-medium">{folder.name}</span>
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

            {/* Verse List Component */}
            <BookmarkVerseList
              verses={displayVerses}
              isLoading={loadingVerses.size > 0 && verses.length === 0}
              error={null}
            />
          </div>
        </div>
      </main>

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
