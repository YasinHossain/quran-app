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

function isValidPosition(position: unknown): position is StoredBookmarkPosition {
  if (typeof position !== 'object' || position === null) return false;
  const p = position as StoredBookmarkPosition;
  return (
    typeof p.surahId === 'number' &&
    typeof p.ayahNumber === 'number' &&
    typeof p.timestamp === 'string'
  );
}

export function isStoredBookmark(value: unknown): value is StoredBookmark {
  if (typeof value !== 'object' || value === null) return false;
  const b = value as StoredBookmark;
  if (typeof b.id !== 'string') return false;
  if (typeof b.userId !== 'string') return false;
  if (typeof b.verseId !== 'string') return false;
  if (typeof b.createdAt !== 'string') return false;
  if (!isValidPosition(b.position)) return false;
  return true;
}
