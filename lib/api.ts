const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.quran.com/api/v4';

import { Chapter, TranslationResource, Verse } from '@/types';

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(`${API_BASE_URL}/chapters?language=en`);
  if (!res.ok) {
    throw new Error(`Failed to fetch chapters: ${res.status}`);
  }
  const data = await res.json();
  return data.chapters as Chapter[];
}

export async function getTranslations(): Promise<TranslationResource[]> {
  const res = await fetch(`${API_BASE_URL}/resources/translations`);
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }
  const data = await res.json();
  return data.translations as TranslationResource[];
}

export interface PaginatedVerses {
  verses: Verse[];
  totalPages: number;
}

export async function getVersesByChapter(
  chapterId: string | number,
  translationId: number,
  page = 1,
  perPage = 20
): Promise<PaginatedVerses> {
  const url = `${API_BASE_URL}/verses/by_chapter/${chapterId}?language=en&words=true&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  return { verses: data.verses as Verse[], totalPages };
}

export async function getVersesByJuz(
  juzId: string | number,
  translationId: number,
  page = 1,
  perPage = 20
): Promise<PaginatedVerses> {
  const url = `${API_BASE_URL}/verses/by_juz/${juzId}?language=en&words=true&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  return { verses: data.verses as Verse[], totalPages };
}

export async function getVersesByPage(
  pageId: string | number,
  translationId: number,
  page = 1,
  perPage = 20
): Promise<PaginatedVerses> {
  const url = `${API_BASE_URL}/verses/by_page/${pageId}?language=en&words=true&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  return { verses: data.verses as Verse[], totalPages };
}

export { API_BASE_URL };
