import { NextResponse } from 'next/server';

import { getVersesOfDayServerForTranslations } from '@/lib/api/server/verses';

const normalizeTranslationsParam = (value: string | null): string => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  const ids = raw
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);

  return Array.from(new Set(ids))
    .sort((a, b) => a - b)
    .join(',');
};

const normalizeCount = (value: string | null): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(Math.max(parsed, 1), 10);
};

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const rawTranslations =
    searchParams.get('translations') ??
    searchParams.get('translationIds') ??
    searchParams.get('translationId');
  const translationsParam = normalizeTranslationsParam(rawTranslations);
  const count = normalizeCount(searchParams.get('count'));

  const verses = await getVersesOfDayServerForTranslations(translationsParam, count);

  return NextResponse.json(verses, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

