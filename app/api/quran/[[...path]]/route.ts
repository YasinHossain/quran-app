import { createHash } from 'node:crypto';

import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/lib/api/client';
import { logger } from '@/src/infrastructure/monitoring/Logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_TTL_MS = (() => {
  const rawTtl = process.env['QURAN_PROXY_TTL_MS'];
  const parsed = rawTtl ? Number.parseInt(rawTtl, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60_000;
})();

const MAX_CACHE_ENTRIES = (() => {
  const rawMax = process.env['QURAN_PROXY_CACHE_SIZE'];
  const parsed = rawMax ? Number.parseInt(rawMax, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 200;
})();

type CacheEntry = {
  body: string;
  etag: string;
  status: number;
  headers: Record<string, string>;
  expiresAt: number;
};

type CacheStore = Map<string, CacheEntry>;

declare global {
  // eslint-disable-next-line no-var
  var __quranProxyCache: CacheStore | undefined;
}

const cacheStore: CacheStore =
  globalThis.__quranProxyCache ?? (globalThis.__quranProxyCache = new Map<string, CacheEntry>());

function pruneCache(): void {
  if (cacheStore.size <= MAX_CACHE_ENTRIES) return;
  const now = Date.now();
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt <= now) {
      cacheStore.delete(key);
    }
  }

  // If the cache is still too large, delete the oldest entries.
  if (cacheStore.size > MAX_CACHE_ENTRIES) {
    const keys = Array.from(cacheStore.keys());
    for (const key of keys) {
      cacheStore.delete(key);
      if (cacheStore.size <= MAX_CACHE_ENTRIES) break;
    }
  }
}

function computeEtag(payload: string): string {
  return createHash('sha1').update(payload).digest('hex');
}

function getTranslationParam(params: URLSearchParams): string {
  const translationParam =
    params.get('translations') ??
    params.get('translation_ids') ??
    params.get('translationId') ??
    '';
  if (!translationParam) return '';
  return translationParam
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .sort((a, b) => {
      const aNum = Number.parseInt(a, 10);
      const bNum = Number.parseInt(b, 10);
      if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
        return a.localeCompare(b);
      }
      return aNum - bNum;
    })
    .join(',');
}

function getWordLanguageParam(params: URLSearchParams): string {
  return (
    params.get('word_translation_language') ??
    params.get('language') ??
    params.get('wordLang') ??
    ''
  ).toLowerCase();
}

function serialiseAdditionalParams(params: URLSearchParams): string {
  return Array.from(params.entries())
    .filter(
      ([key]) =>
        key !== 'translations' &&
        key !== 'translation_ids' &&
        key !== 'translationId' &&
        key !== 'word_translation_language' &&
        key !== 'language' &&
        key !== 'wordLang'
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

function buildCacheKey(pathname: string, params: URLSearchParams): string {
  const translations = getTranslationParam(params);
  const wordLang = getWordLanguageParam(params);
  const otherParams = serialiseAdditionalParams(params);
  return `${pathname}|translations=${translations}|wordLang=${wordLang}|${otherParams}`;
}

function getUpstreamUrl(pathname: string, search: string): URL {
  const trimmed = pathname.replace(/^\//, '');
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const url = new URL(trimmed, base);
  url.search = search;
  return url;
}

function createResponse(
  body: string | null,
  init: ResponseInit,
  cacheStatus: 'HIT' | 'MISS' | 'STALE'
): NextResponse {
  const headers = new Headers(init.headers);
  headers.set('X-Quran-Proxy-Cache', cacheStatus);
  headers.set(
    'Cache-Control',
    headers.get('Cache-Control') ?? 'public, max-age=60, stale-while-revalidate=60'
  );
  return new NextResponse(body, {
    ...init,
    headers,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: { path?: string[] } }
): Promise<NextResponse> {
  const { nextUrl } = request;
  const downstreamPathSegments = context.params.path ?? [];
  const upstreamPath = downstreamPathSegments.join('/');
  const upstreamUrl = getUpstreamUrl(upstreamPath, nextUrl.search);
  const cacheKey = buildCacheKey(upstreamUrl.pathname, upstreamUrl.searchParams);
  const ifNoneMatch = request.headers.get('if-none-match');
  const now = Date.now();

  const cacheEntry = cacheStore.get(cacheKey);
  if (cacheEntry && cacheEntry.expiresAt > now) {
    if (ifNoneMatch && ifNoneMatch === cacheEntry.etag) {
      return createResponse(null, { status: 304, headers: { ETag: cacheEntry.etag } }, 'HIT');
    }
    return createResponse(
      cacheEntry.body,
      { status: cacheEntry.status, headers: cacheEntry.headers },
      'HIT'
    );
  }

  if (cacheEntry && cacheEntry.expiresAt <= now) {
    cacheStore.delete(cacheKey);
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const bodyText = await upstreamResponse.text();
    const upstreamEtag = upstreamResponse.headers.get('etag');
    const etag = upstreamEtag ?? computeEtag(bodyText);
    const status = upstreamResponse.status;
    const propagatedHeaders: Record<string, string> = {
      'Content-Type':
        upstreamResponse.headers.get('content-type') ?? 'application/json; charset=utf-8',
      ETag: etag,
      'Cache-Control': `public, max-age=${Math.floor(DEFAULT_TTL_MS / 1000)}, stale-while-revalidate=${Math.floor(
        DEFAULT_TTL_MS / 1000
      )}`,
    };

    if (ifNoneMatch && ifNoneMatch === etag) {
      return createResponse(null, { status: 304, headers: propagatedHeaders }, 'MISS');
    }

    if (upstreamResponse.ok) {
      pruneCache();
      cacheStore.set(cacheKey, {
        body: bodyText,
        etag,
        status,
        headers: propagatedHeaders,
        expiresAt: now + DEFAULT_TTL_MS,
      });
    }

    return createResponse(
      bodyText,
      { status, headers: propagatedHeaders },
      cacheEntry ? 'STALE' : 'MISS'
    );
  } catch (error) {
    logger.error('Failed to proxy Quran API request', undefined, error as Error);
    if (cacheEntry) {
      return createResponse(
        cacheEntry.body,
        { status: cacheEntry.status, headers: cacheEntry.headers },
        'STALE'
      );
    }
    return NextResponse.json(
      { error: 'Failed to reach Quran service' },
      { status: 502, headers: { 'Cache-Control': 'no-store', 'X-Quran-Proxy-Cache': 'BYPASS' } }
    );
  }
}

export async function HEAD(
  request: NextRequest,
  context: { params: { path?: string[] } }
): Promise<NextResponse> {
  const response = await GET(request, context);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET,HEAD' } }
  );
}

export async function PUT(): Promise<NextResponse> {
  return POST();
}

export async function DELETE(): Promise<NextResponse> {
  return POST();
}
