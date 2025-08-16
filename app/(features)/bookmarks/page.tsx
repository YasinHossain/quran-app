'use client';

import Link from 'next/link';
import { BookmarkIcon } from '@/app/shared/icons';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { Plus } from 'lucide-react';

const mockFolders = [
  { id: 'favorites', name: "Favorite's", count: 2 },
  { id: 'debate', name: 'Debate', count: 2 },
];

export default function BookmarksPage() {
  return (
    <div className="flex flex-grow bg-white dark:bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <div className="flex items-center gap-2">
            <button
              aria-label="Create folder"
              className="p-2 rounded-md border border-[var(--border-color)] hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {mockFolders.map((f) => (
            <Link
              key={f.id}
              href={`/bookmarks/${f.id}`}
              className="rounded-lg border border-[var(--border-color)] p-4 hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="p-3 rounded-md bg-teal-100 text-teal-600">
                  <BookmarkIcon size={20} />
                </span>
                <span className="text-sm text-gray-500">{f.count} bookmarks</span>
              </div>
              <h2 className="font-semibold">{f.name}</h2>
            </Link>
          ))}
        </div>
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
