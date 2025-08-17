'use client';

import React from 'react';
import BookmarkedVersesList from '../components/BookmarkedVersesList';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';

interface PageProps {
  params: Promise<{ folderId: string }>;
}

export default function BookmarkFolderPage({ params }: PageProps) {
  const { folderId } = React.use(params);
  return (
    <div className="flex flex-grow bg-surface text-primary overflow-hidden">
      <main className="flex-grow section overflow-y-auto homepage-scrollable-area">
        <h1 className="text-2xl font-bold mb-6">{folderId.replace(/-/g, ' ')}</h1>
        <BookmarkedVersesList />
      </main>
      <SettingsSidebar
        onTranslationPanelOpen={() => {}}
        onWordLanguagePanelOpen={() => {}}
        onReadingPanelOpen={() => {}}
        selectedTranslationName=""
        selectedWordLanguageName=""
      />
    </div>
  );
}
