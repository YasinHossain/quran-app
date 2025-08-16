'use client';

import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';

export default function PinnedAyahPage() {
  return (
    <div className="flex flex-grow bg-white dark:bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
        <h1 className="text-2xl font-bold mb-6">Pin Ayah</h1>
        <p className="text-gray-500">No pinned verses.</p>
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
