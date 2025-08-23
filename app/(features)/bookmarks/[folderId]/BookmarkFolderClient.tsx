'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { BookmarkFolderSidebar } from '../components/BookmarkFolderSidebar';
import { BookmarkCard } from '../components/BookmarkCard';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { getVerseById } from '@/lib/api';
import { useSettings } from '@/app/providers/SettingsContext';
import type { Verse } from '@/types';
import { BookmarksSidebar } from '../components/BookmarksSidebar';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { useTranslation } from 'react-i18next';
import { useTranslationOptions } from '@/app/(features)/surah/hooks/useTranslationOptions';
import { LANGUAGE_CODES, LanguageCode } from '@/lib/text/languageCodes';

interface BookmarkFolderClientProps {
  folderId: string;
}

export default function BookmarkFolderClient({ folderId }: BookmarkFolderClientProps) {
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const { folders } = useBookmarks();
  const { settings } = useSettings();
  const [activeVerseId, setActiveVerseId] = useState<string | undefined>(undefined);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const { translationOptions, wordLanguageOptions } = useTranslationOptions();

  // Find the current folder and its bookmarks
  const folder = useMemo(() => folders.find((f) => f.id === folderId), [folders, folderId]);
  const bookmarks = useMemo(() => folder?.bookmarks || [], [folder]);

  // Set body overflow hidden like surah page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const verseIds = bookmarks.map((b) => b.verseId);
    Promise.all(verseIds.map((id) => getVerseById(id, settings.translationId)))
      .then(setVerses)
      .catch(() => setVerses([]));
  }, [bookmarks, settings.translationId]);

  const displayVerses = useMemo(() => {
    if (!verses.length) return [];
    if (activeVerseId) return verses.filter((v) => String(v.id) === activeVerseId);
    return verses;
  }, [verses, activeVerseId]);

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
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMobileSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Left Sidebar - Unified navigation + folder verses as cards */}
      <aside
        className={`fixed left-0 lg:left-16 top-16 h-[calc(100vh-4rem)] w-80 lg:w-[20.7rem] bg-surface border-r border-border z-50 lg:z-10 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <BookmarksSidebar
          activeSection="bookmarks"
          onSectionChange={(section) => {
            if (section === 'pinned') router.push('/bookmarks/pinned');
            else if (section === 'last-read') router.push('/bookmarks/last-read');
            else router.push('/bookmarks');
          }}
        >
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-foreground truncate" title={folder.name}>
              {folder.name}
            </h3>
            <p className="text-xs text-muted">{bookmarks.length} items</p>
          </div>
          <div className="space-y-3">
            {bookmarks.length === 0 ? (
              <p className="text-sm text-muted">This folder is empty.</p>
            ) : (
              bookmarks.map((bm) => (
                <BookmarkCard key={bm.verseId} bookmark={bm} folderId={folder.id} />)
              )
            )}
          </div>
        </BookmarksSidebar>
      </aside>

      {/* Mobile Header with Sidebar Toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 h-12 bg-surface border-b border-border z-30 flex items-center px-4">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-surface-hover transition-colors"
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
      <main className="h-screen text-foreground font-sans lg:ml-[20.7rem] overflow-hidden">
        <div
          className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
            isHidden
              ? 'pt-12 lg:pt-0' // Account for mobile header
              : 'pt-[calc(3.5rem+3rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+3rem+env(safe-area-inset-top))] lg:pt-[calc(3.5rem+env(safe-area-inset-top))] lg:sm:pt-[calc(4rem+env(safe-area-inset-top))]'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {bookmarks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">No verses in this folder</p>
              </div>
            ) : displayVerses.length === 0 && activeVerseId ? (
              <div className="text-center py-12">
                <p className="text-muted">Loading verse...</p>
              </div>
            ) : (
              displayVerses.map((v) => {
                const bookmark = bookmarks.find((b) => b.verseId === String(v.id));
                return bookmark ? (
                  <BookmarkCard key={v.id} bookmark={bookmark} folderId={folder.id} />
                ) : null;
              })
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Settings */}
      <SettingsSidebar
        onTranslationPanelOpen={() => {}}
        onWordLanguagePanelOpen={() => {}}
        onReadingPanelOpen={() => {}}
        selectedTranslationName={selectedTranslationName}
        selectedWordLanguageName={selectedWordLanguageName}
        pageType="verse"
      />
    </>
  );
}
