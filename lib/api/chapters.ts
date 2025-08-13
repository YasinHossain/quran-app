import { Chapter } from '@/types';
import { apiFetch } from './client';
import { surahImageMap } from '@/app/(features)/surah/lib/surahImageMap';

export async function getChapters(): Promise<Chapter[]> {
  const data = await apiFetch<{ chapters: Chapter[] }>(
    'chapters',
    { language: 'en' },
    'Failed to fetch chapters'
  );
  return data.chapters as Chapter[];
}

export async function getSurahCoverUrl(surahNumber: number): Promise<string | null> {
  const filename = surahImageMap[surahNumber];
  if (!filename) return null;

  try {
    const response = await fetch(`https://api.wikimedia.org/core/v1/commons/file/File:${filename}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.preferred.url || null;
  } catch (error) {
    console.error('Error fetching surah cover:', error);
    return null;
  }
}
