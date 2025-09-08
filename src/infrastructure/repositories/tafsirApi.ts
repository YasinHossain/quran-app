import { apiFetch } from '@/lib/api/client';
import { Tafsir, TafsirData } from '@/src/domain/entities/Tafsir';
import { logger } from '@/src/infrastructure/monitoring/Logger';

interface ApiTafsirResource {
  id: number;
  slug: string;
  name: string;
  language_name: string;
  author_name?: string;
}

function mapApiResponseToEntities(apiTafsirs: ApiTafsirResource[]): Tafsir[] {
  return apiTafsirs.map((apiTafsir) => {
    const tafsirData: TafsirData = {
      id: apiTafsir.id,
      name: apiTafsir.name,
      lang: apiTafsir.language_name,
      authorName: apiTafsir.author_name,
      slug: apiTafsir.slug,
    };
    return new Tafsir(tafsirData);
  });
}

export async function fetchResourcesForLanguage(language?: string): Promise<Tafsir[]> {
  const params: Record<string, string> = language
    ? { language, per_page: '200', page: '1' }
    : { per_page: '200', page: '1' };

  try {
    const data = await apiFetch<{ tafsirs: ApiTafsirResource[] }>(
      'resources/tafsirs',
      params,
      'Failed to fetch tafsir resources'
    );

    if (data.tafsirs && data.tafsirs.length > 0) {
      return mapApiResponseToEntities(data.tafsirs);
    }
  } catch (error) {
    logger.warn('Primary API failed, trying CDN fallback', undefined, error as Error);
  }

  const url = 'https://api.qurancdn.com/api/qdc/resources/tafsirs';
  const cdnParams: Record<string, string> = { per_page: '200', page: '1' };
  if (language && language !== 'all') {
    cdnParams.language = language;
  }
  const fallbackData = await apiFetch<{ tafsirs: ApiTafsirResource[] }>(
    url,
    cdnParams,
    'Failed to fetch tafsir resources'
  );
  return mapApiResponseToEntities(fallbackData.tafsirs || []);
}
