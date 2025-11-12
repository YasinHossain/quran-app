import type { Bookmark, Chapter } from '@/types';

export interface BookmarkUpdatePayload {
  targetVerseId: string;
  patch: Partial<Bookmark>;
}

export function sortChaptersById(chapters: Chapter[]): Chapter[] {
  return [...chapters].sort((a, b) => a.id - b.id);
}

export function parseNumericId(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
}
