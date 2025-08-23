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
  const { folders } = useBookmarks();
  const { settings } = useSettings();
  const [activeVerseId, setActiveVerseId] = useState<string | undefined>(undefined);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isMobileFolderOpen, setIsMobileFolderOpen] = useState(false);
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

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

  if (!folder) {
    return (
      <div className="h-screen text-foreground font-sans overflow-hidden">
               {' '}
        <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-center">
                   {' '}
          <div className="text-center">
                       {' '}
            <h1 className="text-2xl font-bold text-foreground mb-2">Folder Not Found</h1>           {' '}
            <p className="text-muted">The requested bookmark folder does not exist.</p>       
             {' '}
          </div>
                 {' '}
        </div>
             {' '}
      </div>
    );
  }

  return (
    <>
            {/* Mobile Sidebar Overlay */}     {' '}
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
            {/* Left Sidebar - navigation */}     {' '}
      <aside
        className={`fixed left-0 lg:left-16 top-16 h-[calc(100vh-4rem)] w-80 lg:w-[20.7rem] bg-surface border-r border-border z-50 lg:z-10 transition-transform duration-300 ${
          isMobileFolderOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
               {' '}
        <BookmarkFolderSidebar
          bookmarks={bookmarks}
          folder={folder}
          activeVerseId={activeVerseId}
          onVerseSelect={(verseId) => {
            setActiveVerseId(verseId);
            setIsMobileFolderOpen(false);
          }}
          onBack={() => router.push('/bookmarks')}
        />
             {' '}
      </aside>
            {/* Mobile Header with Sidebar Toggle */}     {' '}
      <div className="lg:hidden fixed top-16 left-0 right-0 h-12 bg-surface border-b border-border z-30 flex items-center px-4">
               {' '}
        <button
          onClick={() => setIsMobileFolderOpen(true)}
          className="p-2 rounded-md hover:bg-surface-hover transition-colors"
          aria-label="Open sidebar"
        >
                   {' '}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       {' '}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
                     {' '}
          </svg>
                 {' '}
        </button>
                <h1 className="ml-3 text-lg font-semibold truncate">{folder.name}</h1>     {' '}
      </div>
            {/* Main Content - Verse display */}     {' '}
      <main className="h-screen text-foreground font-sans lg:ml-[20.7rem] overflow-hidden">
               {' '}
        <div
          className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
            isHidden
              ? 'pt-12 lg:pt-0'
              : 'pt-[calc(3.5rem+3rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+3rem+env(safe-area-inset-top))] lg:pt-[calc(3.5rem+env(safe-area-inset-top))] lg:sm:pt-[calc(4rem+env(safe-area-inset-top))]'
          }`}
        >
                   {' '}
          <div className="max-w-4xl mx-auto">
                       {' '}
            {bookmarks.length === 0 ? (
              <div className="text-center py-12">
                                <p className="text-muted">No verses in this folder</p>           
                 {' '}
              </div>
            ) : displayVerses.length === 0 && activeVerseId ? (
              <div className="text-center py-12">
                                <p className="text-muted">Loading verse...</p>             {' '}
              </div>
            ) : (
              displayVerses.map((v) => {
                const bookmark = bookmarks.find((b) => b.verseId === String(v.id));
                return bookmark ? (
                  <BookmarkCard key={v.id} bookmark={bookmark} folderId={folder.id} />
                ) : null;
              })
            )}
                     {' '}
          </div>
                 {' '}
        </div>
             {' '}
      </main>
           {' '}
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
            {/* Right Sidebar - folder explorer */}     {' '}
      <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 lg:w-[20.7rem] bg-surface border-l border-border hidden lg:block overflow-y-auto">
               {' '}
        <BookmarkFolderSidebar
          bookmarks={bookmarks}
          folder={{ id: folder.id, name: folder.name }}
          activeVerseId={activeVerseId}
          onVerseSelect={setActiveVerseId}
          onBack={() => router.push('/bookmarks')}
        />
             {' '}
      </aside>
         {' '}
    </>
  );
}
