import { TafsirResource } from '@/types';
import { apiFetch } from './client';
// Clean Architecture imports
import { container } from '@/src/infrastructure/di/container';
import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { GetTafsirContentUseCase } from '@/src/application/use-cases/GetTafsirContent';

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
  // Ensure we request a large page size so we don't get only a subset
  const params: Record<string, string> = language
    ? { language, per_page: '200', page: '1' }
    : { per_page: '200', page: '1' };
  // Primary: use configured API base (env may override)
  try {
    const data = await apiFetch<{ tafsirs: ApiTafsirResource[] }>(
      'resources/tafsirs',
      params,
      'Failed to fetch tafsir resources'
    );
    const mapped = mapTafsirs(data.tafsirs);
    // If response is suspiciously small (e.g., only default), try CDN fallback
    if (mapped.length > 1) return mapped;
  } catch (e) {
    // Fall through to CDN fallback
  }

  // Fallback: query Qurancdn (QDC) directly for better availability
  const url = new URL('https://api.qurancdn.com/api/qdc/resources/tafsirs');
  if (language) url.searchParams.set('language', language);
  // Mirror primary request pagination on fallback as well
  url.searchParams.set('per_page', '200');
  url.searchParams.set('page', '1');
  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Failed to fetch tafsir resources (cdn): ${res.status}`);
  }
  const json = (await res.json()) as { tafsirs: ApiTafsirResource[] };
  return mapTafsirs(json.tafsirs);
}

/**
 * DEPRECATED: Use clean architecture implementation instead.
 * This function now delegates to the new clean architecture.
 */
export async function getTafsirByVerse(verseKey: string, tafsirId = 169): Promise<string> {
  try {
    // Use clean architecture
    const repository = container.getTafsirRepository();
    const useCase = new GetTafsirContentUseCase(repository);
    return await useCase.execute(verseKey, tafsirId);
  } catch (error) {
    console.warn('Clean architecture failed, falling back to legacy implementation:', error);

    // Legacy fallback
    try {
      const data = await apiFetch<{ tafsir?: { text: string } }>(
        `tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`,
        {},
        'Failed to fetch tafsir'
      );
      if (data?.tafsir?.text) return data.tafsir.text as string;
    } catch (e) {
      // fall through to CDN fallback
    }

    // Fallback to CDN endpoint
    const cdnUrl = `https://api.qurancdn.com/api/qdc/tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(
      verseKey
    )}`;
    const res = await fetch(cdnUrl, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`Failed to fetch tafsir (cdn): ${res.status}`);
    }
    const json = (await res.json()) as { tafsir?: { text: string } };
    return (json.tafsir?.text as string) ?? '';
  }
}

/**
 * DEPRECATED: Use clean architecture implementation instead.
 * This function now delegates to the new clean architecture.
 *
 * Fetch tafsir resources across languages using clean architecture.
 */
export async function getAllTafsirResources(): Promise<TafsirResource[]> {
  try {
    // Use clean architecture
    const repository = container.getTafsirRepository();
    const useCase = new GetTafsirResourcesUseCase(repository);
    const result = await useCase.execute();

    // Convert domain entities back to legacy format for backward compatibility
    return result.tafsirs.map((domainTafsir) => ({
      id: domainTafsir.id,
      name: domainTafsir.displayName,
      lang: domainTafsir.language, // Keep original format
    }));
  } catch (error) {
    console.warn('Clean architecture failed, falling back to legacy implementation:', error);

    // Legacy fallback
    try {
      const all = await getTafsirResources('all');
      if (all.length > 1) return all;
    } catch {
      // fallthrough to language probes
    }

    const langs = ['en', 'ar', 'bn', 'ur', 'id', 'tr', 'fa'];
    const results = await Promise.allSettled(langs.map((l) => getTafsirResources(l)));
    const mergedMap = new Map<number, TafsirResource>();
    for (const r of results) {
      if (r.status === 'fulfilled') {
        for (const t of r.value) {
          if (!mergedMap.has(t.id)) mergedMap.set(t.id, t);
        }
      }
    }
    return Array.from(mergedMap.values());
  }
}
