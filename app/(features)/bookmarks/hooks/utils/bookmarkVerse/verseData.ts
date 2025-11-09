import { BookmarkUpdatePayload, parseNumericId } from './shared';

import type { Bookmark, Chapter, Verse } from '@/types';

export function buildFallbackVerse(bookmark: Bookmark, verseKey: string | null): Verse | undefined {
  if (!verseKey) {
    return undefined;
  }

  const verseText = bookmark.verseText?.trim();
  if (!verseText) {
    return undefined;
  }

  const translationText = bookmark.translation?.trim();

  return {
    id: selectFallbackVerseId(bookmark, verseKey),
    verse_key: verseKey,
    text_uthmani: verseText,
    ...buildTranslationPayload(bookmark, translationText),
  };
}

export function enrichBookmarkWithVerse(params: {
  normalizedBookmark: Bookmark;
  resolvedVerse: Verse | undefined;
  chapters: Chapter[];
  fallbackTranslation?: string | null;
}): Bookmark {
  const { normalizedBookmark, resolvedVerse, chapters, fallbackTranslation } = params;
  if (!resolvedVerse) {
    return normalizedBookmark;
  }

  const surahName = findSurahNameFromKey(resolvedVerse.verse_key, chapters);
  const translationText =
    resolvedVerse.translations?.[0]?.text ?? fallbackTranslation ?? normalizedBookmark.translation;

  return {
    ...normalizedBookmark,
    verseKey: resolvedVerse.verse_key,
    verseApiId: resolvedVerse.id,
    verseText: resolvedVerse.text_uthmani,
    surahName,
    ...(translationText ? { translation: translationText } : {}),
  };
}

export function buildVerseDataPatch(params: {
  verse: Verse | undefined;
  normalizedBookmark: Bookmark;
  chapters: Chapter[];
}): BookmarkUpdatePayload | null {
  const { verse, normalizedBookmark, chapters } = params;
  if (!verse || !normalizedBookmark.verseId) {
    return null;
  }

  const surahName = findSurahNameFromKey(verse.verse_key, chapters);
  const translationText = verse.translations?.[0]?.text;

  if (
    isBookmarkDataUpToDate({
      normalizedBookmark,
      verse,
      surahName,
      translationText,
    })
  ) {
    return null;
  }

  return {
    targetVerseId: normalizedBookmark.verseId,
    patch: {
      verseKey: verse.verse_key,
      verseApiId: verse.id,
      verseText: verse.text_uthmani,
      surahName,
      ...(translationText ? { translation: translationText } : {}),
    },
  };
}

function findSurahNameFromKey(verseKey: string, chapters: Chapter[]): string {
  const [surahIdStr] = verseKey.split(':');
  const surahId = surahIdStr ? Number.parseInt(surahIdStr, 10) : NaN;
  if (!Number.isFinite(surahId)) {
    return `Surah ${surahIdStr || ''}`;
  }
  const chapter = chapters.find((c) => c.id === surahId);
  return chapter?.name_simple || `Surah ${surahIdStr}`;
}

function fallbackIdFromVerseKey(verseKey: string): number | null {
  const [surahPart, ayahPartWithRange] = verseKey.split(':');
  const [ayahPart] = (ayahPartWithRange ?? '').split('-');
  const surahNumber = Number.parseInt(surahPart ?? '', 10);
  const ayahNumber = Number.parseInt(ayahPart ?? '', 10);
  if (Number.isFinite(surahNumber) && Number.isFinite(ayahNumber)) {
    return surahNumber * 1000 + ayahNumber;
  }
  return null;
}

function selectFallbackVerseId(bookmark: Bookmark, verseKey: string): number {
  const candidate =
    getFiniteNumber(bookmark.verseApiId) ??
    parseNumericId(bookmark.verseId) ??
    fallbackIdFromVerseKey(verseKey) ??
    0;

  return candidate > 0 ? candidate : 0;
}

function getFiniteNumber(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function buildTranslationPayload(
  bookmark: Bookmark,
  translationText?: string | null
): Pick<Verse, 'translations'> | Record<string, never> {
  if (!translationText) {
    return {};
  }

  return {
    translations: [
      {
        resource_id: bookmark.verseApiId ?? 0,
        text: translationText,
      },
    ],
  };
}

function isBookmarkDataUpToDate(params: {
  normalizedBookmark: Bookmark;
  verse: Verse;
  surahName: string;
  translationText?: string;
}): boolean {
  const { normalizedBookmark, verse, surahName, translationText } = params;
  const matchesCoreFields =
    normalizedBookmark.verseKey === verse.verse_key &&
    normalizedBookmark.verseApiId === verse.id &&
    normalizedBookmark.verseText === verse.text_uthmani &&
    normalizedBookmark.surahName === surahName;

  const translationMatches =
    translationText === undefined || normalizedBookmark.translation === translationText;

  return matchesCoreFields && translationMatches;
}
