import { apiFetch } from '@/lib/api/client';

import { resolveApiMushafId } from './readingViewClient';

export type MushafResourceKind = 'surah' | 'juz' | 'page';

type PagesLookupRange = {
  from: string;
  to: string;
};

export type PagesLookupRecord = PagesLookupRange & {
  firstVerseKey: string;
  lastVerseKey: string;
};

export type PagesLookupResult = {
  totalPage: number;
  lookupRange: PagesLookupRange;
  pages: Record<number, PagesLookupRecord>;
};

type PagesLookupApiRecord = PagesLookupRange & {
  first_verse_key: string;
  last_verse_key: string;
};

type PagesLookupApiResponse = {
  total_page: number;
  lookup_range: PagesLookupRange;
  pages: Record<string, PagesLookupApiRecord>;
};

const toNumberKey = (key: string): number | null => {
  const parsed = Number.parseInt(key, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapPagesLookupRecord = (record: PagesLookupApiRecord): PagesLookupRecord => ({
  from: record.from,
  to: record.to,
  firstVerseKey: record.first_verse_key,
  lastVerseKey: record.last_verse_key,
});

const mapPagesLookupResponse = (data: PagesLookupApiResponse): PagesLookupResult => {
  const pages: Record<number, PagesLookupRecord> = {};
  Object.entries(data.pages ?? {}).forEach(([pageNumberRaw, record]) => {
    const pageNumber = toNumberKey(pageNumberRaw);
    if (typeof pageNumber === 'number') {
      pages[pageNumber] = mapPagesLookupRecord(record);
    }
  });

  return {
    totalPage: data.total_page,
    lookupRange: data.lookup_range,
    pages,
  };
};

export async function getMushafPagesLookup({
  resourceKind,
  resourceId,
  mushafId,
}: {
  resourceKind: MushafResourceKind;
  resourceId: number;
  mushafId: string;
}): Promise<PagesLookupResult> {
  const mushaf = resolveApiMushafId(mushafId);

  const params: Record<string, string> = {
    mushaf: String(mushaf),
  };

  if (resourceKind === 'surah') {
    params['chapter_number'] = String(resourceId);
  } else if (resourceKind === 'juz') {
    params['juz_number'] = String(resourceId);
  } else {
    params['page_number'] = String(resourceId);
  }

  const data = await apiFetch<PagesLookupApiResponse>(
    'pages/lookup',
    params,
    'Failed to fetch pages lookup'
  );
  return mapPagesLookupResponse(data);
}
