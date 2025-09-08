import { apiFetch } from '@/lib/api/client';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { fetchResourcesForLanguage } from './tafsirApi';
import { cacheResources as cacheTafsirResources } from './tafsirCache';

export async function fetchAllResources(): Promise<Tafsir[]> {
  const allResources = await tryFetchAll();
  if (allResources) {
    return allResources;
  }

  return fetchLanguageSpecificResources();
}

async function tryFetchAll(): Promise<Tafsir[] | null> {
  try {
    const allResources = await fetchResourcesForLanguage('all');
    if (allResources.length <= 1) {
      return null;
    }

    await cacheTafsirResources(allResources);
    return allResources;
  } catch (error) {
    logger.warn(
      'Failed to fetch all tafsir resources, trying language-specific approach',
      undefined,
      error as Error
    );
    return null;
  }
}

async function fetchLanguageSpecificResources(): Promise<Tafsir[]> {
  const languages = ['en', 'ar', 'bn', 'ur', 'id', 'tr', 'fa'];
  const results = await Promise.allSettled(
    languages.map((lang) => fetchResourcesForLanguage(lang))
  );

  const tafsirs = mergeResults(results);
  if (tafsirs.length === 0) {
    return [];
  }

  await cacheTafsirResources(tafsirs);
  return tafsirs;
}

function mergeResults(results: PromiseSettledResult<Tafsir[]>[]): Tafsir[] {
  const mergedMap = new Map<number, Tafsir>();

  const addToMap = (tafsir: Tafsir): void => {
    if (!mergedMap.has(tafsir.id)) {
      mergedMap.set(tafsir.id, tafsir);
    }
  };

  results
    .filter((r): r is PromiseFulfilledResult<Tafsir[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .forEach(addToMap);

  return Array.from(mergedMap.values());
}

export async function fetchTafsirByVerse(verseKey: string, tafsirId: number): Promise<string> {
  try {
    const data = await apiFetch<{ tafsir?: { text: string } }>(
      `tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`,
      {},
      'Failed to fetch tafsir'
    );
    if (data?.tafsir?.text) {
      return data.tafsir.text;
    }
  } catch (error) {
    logger.warn('Primary tafsir API failed, trying fallback', undefined, error as Error);
  }

  const cdnUrl = `https://api.qurancdn.com/api/qdc/tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(
    verseKey
  )}`;
  const data = await apiFetch<{ tafsir?: { text: string } }>(
    cdnUrl,
    {},
    'Failed to fetch tafsir content'
  );
  return data.tafsir?.text || '';
}
