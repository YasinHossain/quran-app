import { TafsirResource } from '@/types';
import { apiFetch } from './client';

interface ApiTafsirResource {
  id: number;
  slug: string;
  name: string;
  language_name: string;
}

export async function getTafsirResources(): Promise<TafsirResource[]> {
  const data = await apiFetch<{ tafsirs: ApiTafsirResource[] }>(
    'resources/tafsirs',
    {},
    'Failed to fetch tafsir resources'
  );
  return data.tafsirs.map((t) => ({
    id: t.id,
    name: t.name,
    lang: t.language_name,
  }));
}

export async function getTafsirByVerse(verseKey: string, tafsirId = 169): Promise<string> {
  const data = await apiFetch<{ tafsir?: { text: string } }>(
    `tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`,
    {},
    'Failed to fetch tafsir'
  );
  return data.tafsir?.text as string;
}
