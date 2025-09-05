import { TafsirResource } from '@/types';

import { apiFetch } from './client';

interface ApiTafsirResource {
  id: number;
  slug: string;
  name: string;
  language_name: string;
}

function mapTafsirs(items: ApiTafsirResource[]): TafsirResource[] {
  return items.map((t) => ({ id: t.id, name: t.name, lang: t.language_name }));
}

export async function getTafsirResources(language?: string): Promise<TafsirResource[]> {
  const params: Record<string, string> = language
    ? { language, per_page: '200', page: '1' }
    : { per_page: '200', page: '1' };

  const data = await apiFetch<{ tafsirs: ApiTafsirResource[] }>(
    'resources/tafsirs',
    params,
    'Failed to fetch tafsir resources'
  );

  return mapTafsirs(data.tafsirs);
}
