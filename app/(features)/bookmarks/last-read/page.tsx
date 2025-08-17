'use client';

import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';

export default function LastReadPage() {
  return (
    <div className="flex flex-grow bg-surface text-primary overflow-hidden">
      <main className="flex-grow section overflow-y-auto homepage-scrollable-area">
        <h1 className="text-2xl font-bold mb-6">Last Read</h1>
        <p className="text-muted">No last read verse.</p>
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
