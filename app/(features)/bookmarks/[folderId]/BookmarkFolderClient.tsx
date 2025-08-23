'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { BookmarkVerseSidebar } from '../components/BookmarkVerseSidebar';
import { BookmarkListView } from '../components/BookmarkListView';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

interface BookmarkFolderClientProps {
  folderId: string;
}

export default function BookmarkFolderClient({ folderId }: BookmarkFolderClientProps) {
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const { folders } = useBookmarks();
  const [activeVerseId, setActiveVerseId] = useState<string | undefined>(undefined);

  // Find the current folder and its bookmarks
  const folder = useMemo(() => folders.find((f) => f.id === folderId), [folders, folderId]);
  const bookmarks = useMemo(() => folder?.bookmarks || [], [folder]);

  const displayBookmarks = useMemo(() => {
    if (!bookmarks?.length) return [];
    if (activeVerseId) return bookmarks.filter((b) => b.verseId === activeVerseId);
    return bookmarks;
  }, [bookmarks, activeVerseId]);

  if (!folder) {
    return (
      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background text-foreground overflow-hidden">
        <div className="flex-grow flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Folder Not Found</h1>
            <p className="text-muted">The requested bookmark folder does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background text-foreground overflow-hidden">
      {/* Left Sidebar - Bookmarked verses list (matches app sidebar sizing) */}
      <aside className="w-80 lg:w-[20.7rem] h-full bg-surface border-r border-border flex-shrink-0">
        <BookmarkVerseSidebar
          bookmarks={bookmarks}
          folder={folder}
          activeVerseId={activeVerseId}
          onVerseSelect={setActiveVerseId}
          onBack={() => router.push('/bookmarks')}
        />
      </aside>

      {/* Main Content - Verse display (reuse verse page styling) */}
      <main className="flex-1 h-full overflow-hidden">
        <div
          className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
            isHidden
              ? 'pt-0'
              : 'pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <BookmarkListView bookmarks={displayBookmarks} folder={folder} showAsVerseList={true} />
          </div>
        </div>
      </main>
    </div>
  );
}

