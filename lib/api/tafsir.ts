import { apiFetch } from './client';

export interface TafsirResource {
  id: number;
  slug: string;
  name: string;
  language_name: string;
}

export async function getTafsirResources(): Promise<TafsirResource[]> {
  const data = await apiFetch<{ tafsirs: TafsirResource[] }>(
    'resources/tafsirs',
    {},
    'Failed to fetch tafsir resources'
  );
  return data.tafsirs as TafsirResource[];
}

export async function getTafsirByVerse(verseKey: string, tafsirId = 169): Promise<string> {
  const data = await apiFetch<{ tafsir?: { text: string } }>(
    `tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`,
    {},
    'Failed to fetch tafsir'
  );
  return data.tafsir?.text as string;
}
