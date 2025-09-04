export interface StoredBookmarkPosition {
  surahId: number;
  ayahNumber: number;
  verseKey: string;
  timestamp: string;
  isFirstVerse: boolean;
  displayText: string;
}

export interface StoredBookmark {
  id: string;
  userId: string;
  verseId: string;
  position: StoredBookmarkPosition;
  createdAt: string;
  notes?: string | undefined;
  tags: string[];
}

export function isStoredBookmark(value: unknown): value is StoredBookmark {
  if (typeof value !== 'object' || value === null) return false;
  const b = value as StoredBookmark;
  return (
    typeof b.id === 'string' &&
    typeof b.userId === 'string' &&
    typeof b.verseId === 'string' &&
    typeof b.createdAt === 'string' &&
    typeof b.position === 'object' &&
    b.position !== null &&
    typeof b.position.surahId === 'number' &&
    typeof b.position.ayahNumber === 'number' &&
    typeof b.position.timestamp === 'string'
  );
}
