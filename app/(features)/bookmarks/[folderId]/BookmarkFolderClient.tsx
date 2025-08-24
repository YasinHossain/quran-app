'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { BookmarkFolderSidebar } from '../components/BookmarkFolderSidebar';
import { BookmarkVerseList } from '../components/BookmarkVerseList';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { getVerseById, getVerseByKey } from '@/lib/api';
import { useSettings } from '@/app/providers/SettingsContext';
import type { Verse } from '@/types';

// Simple cache for verses
const verseCache = new Map<string, Verse>();
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import useTranslationOptions from '@/app/(features)/surah/hooks/useTranslationOptions';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';

interface BookmarkFolderClientProps {
  folderId: string;
}

export default function BookmarkFolderClient({ folderId }: BookmarkFolderClientProps) {
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const bookmarkContext = useBookmarks();
  const { folders } = bookmarkContext;

  const { settings } = useSettings();
  const [activeVerseId, setActiveVerseId] = useState<string | undefined>(undefined);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isMobileFolderOpen, setIsMobileFolderOpen] = useState(false);
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [loadedVerses, setLoadedVerses] = useState<Set<string>>(new Set());
  const [loadingVerses, setLoadingVerses] = useState<Set<string>>(new Set());

  const { t } = useTranslation();
  const { translationOptions, wordLanguageOptions } = useTranslationOptions();

  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation'),
    [settings.translationId, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(
    () =>
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
          settings.wordLang
      )?.name || t('select_word_translation'),
    [settings.wordLang, wordLanguageOptions, t]
  );

  const folder = useMemo(() => folders.find((f) => f.id === folderId), [folders, folderId]);
  const bookmarks = useMemo(() => folder?.bookmarks || [], [folder]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Function to load verses with caching
  const getVerseWithCache = useCallback(async (verseId: string, translationId: number) => {
    const cacheKey = `${verseId}-${translationId}`;

    if (verseCache.has(cacheKey)) {
      return verseCache.get(cacheKey)!;
    }

    // Check if verseId is a composite key (e.g., "2:255") or a simple number
    const isCompositeKey = /:/.test(verseId);
    const isSimpleNumber = /^[0-9]+$/.test(verseId);

    let verse;
    if (isCompositeKey) {
      // It's already a verse key like "2:255"
      verse = await getVerseByKey(verseId, translationId);
    } else if (isSimpleNumber) {
      // It's a simple number like "1", "2", "3" - assume it's "1:1", "1:2", "1:3"
      const verseKey = `1:${verseId}`;
      verse = await getVerseByKey(verseKey, translationId);
    } else {
      // Try as direct verse ID
      verse = await getVerseById(verseId, translationId);
    }

    verseCache.set(cacheKey, verse);
    return verse;
  }, []);

  // Load all verses immediately (remove lazy loading for now to fix the display issue)
  useEffect(() => {
    const loadAllVerses = async () => {
      const verseIds = bookmarks.map((b) => b.verseId);

      if (verseIds.length === 0) {
        setVerses([]);
        setLoadedVerses(new Set());
        setLoadingVerses(new Set());
        return;
      }

      setLoadingVerses(new Set(verseIds));

      try {
        const loadedVerses = await Promise.all(
          verseIds.map((id) => getVerseWithCache(id, settings.translationId))
        );
        setVerses(loadedVerses);
        setLoadedVerses(new Set(verseIds));
      } catch (error) {
        setVerses([]);
        console.error('Failed to load verses:', error);
      } finally {
        setLoadingVerses(new Set());
      }
    };

    loadAllVerses();
  }, [bookmarks, settings.translationId, getVerseWithCache]);

  // Function to load more verses on demand (removed for now but kept for future use)
  // const loadMoreVerses = useCallback(
  //   async (startIndex: number, count: number = 10) => {
  //     const batch = bookmarks.slice(startIndex, startIndex + count);
  //     const verseIds = batch.map((b) => b.verseId).filter((id) => !loadedVerses.has(id));

  //     if (verseIds.length === 0) return;

  //     setLoadingVerses((prev) => new Set([...prev, ...verseIds]));

  //     try {
  //       const newVerses = await Promise.all(
  //         verseIds.map((id) => getVerseWithCache(id, settings.translationId))
  //       );

  //       setVerses((prev) => [...prev, ...newVerses]);
  //       setLoadedVerses((prev) => new Set([...prev, ...verseIds]));
  //     } catch (error) {
  //       console.error('Failed to load verses:', error);
  //     } finally {
  //       setLoadingVerses((prev) => {
  //         const updated = new Set(prev);
  //         verseIds.forEach((id) => updated.delete(id));
  //         return updated;
  //       });
  //     }
  //   },
  //   [bookmarks, settings.translationId, loadedVerses, getVerseWithCache]
  // );

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
    return (
      <div className="h-screen text-foreground font-sans overflow-hidden">
        <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Folder Not Found</h1>
            <p className="text-muted">The requested bookmark folder does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileFolderOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileFolderOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMobileFolderOpen(false);
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Left Sidebar - navigation */}
      <aside
        className={`fixed left-0 lg:left-16 top-16 h-[calc(100vh-4rem)] w-80 lg:w-[20.7rem] bg-surface border-r border-border z-50 lg:z-10 transition-transform duration-300 ${
          isMobileFolderOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <BookmarkFolderSidebar
          bookmarks={bookmarks}
          folder={folder}
          activeVerseId={activeVerseId}
          onVerseSelect={(verseId) => {
            setActiveVerseId(verseId === activeVerseId ? undefined : verseId);
            setIsMobileFolderOpen(false);
          }}
          onBack={() => router.push('/bookmarks')}
        />
      </aside>

      {/* Mobile Header with Sidebar Toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 h-12 bg-surface border-b border-border z-30 flex items-center px-4">
        <button
          onClick={() => setIsMobileFolderOpen(true)}
          className="p-2 rounded-md hover:bg-surface-hover transition-colors touch-manipulation"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="ml-3 text-lg font-semibold truncate">{folder.name}</h1>
      </div>

      {/* Main Content - Verse display */}
      <main className="h-screen text-foreground font-sans lg:ml-[20.7rem] overflow-hidden relative z-50">
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
