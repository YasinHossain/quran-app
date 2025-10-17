import { features } from '@/config';

// Prefer the CDN-backed QDC API for higher availability; can be overridden via env
const API_BASE_URL = process.env['QURAN_API_BASE_URL'] ?? 'https://api.qurancdn.com/api/qdc';

const PROXY_ROUTE_PATH = '/api/quran';
let memoizedServerProxyBase: string | null | undefined;

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function normaliseOrigin(candidate?: string | null): string | null {
  if (!candidate) return null;
  const trimmed = candidate.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/$/, '');
  }
  return `https://${trimmed.replace(/\/$/, '')}`;
}

function resolveProxyBase(): string | null {
  if (!features.enableQuranApiProxy) return null;

  if (typeof window !== 'undefined' && window.location) {
    return ensureTrailingSlash(`${window.location.origin}${PROXY_ROUTE_PATH}`);
  }

  if (memoizedServerProxyBase !== undefined) {
    return memoizedServerProxyBase;
  }

  const originCandidates: Array<string | null | undefined> = [
    process.env['INTERNAL_API_ORIGIN'],
    process.env['NEXT_PUBLIC_APP_ORIGIN'],
    process.env['APP_ORIGIN'],
    process.env['APP_URL'],
    process.env['SITE_URL'],
    process.env['NEXTAUTH_URL'],
    process.env['URL'],
    process.env['VERCEL_URL'],
    process.env['NEXT_PUBLIC_VERCEL_URL'],
  ];

  for (const candidate of originCandidates) {
    const origin = normaliseOrigin(candidate);
    if (origin) {
      memoizedServerProxyBase = ensureTrailingSlash(`${origin}${PROXY_ROUTE_PATH}`);
      return memoizedServerProxyBase;
    }
  }

  const port = process.env['PORT'] ?? '3000';
  memoizedServerProxyBase = ensureTrailingSlash(`http://127.0.0.1:${port}${PROXY_ROUTE_PATH}`);
  return memoizedServerProxyBase;
}

function resolveBaseUrl(): string {
  const proxyBase = resolveProxyBase();
  if (proxyBase) return proxyBase;
  return ensureTrailingSlash(API_BASE_URL);
}

interface FetchWithTimeoutOptions extends RequestInit {
  /** Message prefix used if the request fails */
  errorPrefix?: string;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Generic fetch wrapper that adds timeout handling and standardized error messages.
 */
async function fetchWithTimeout(
  url: string,
  { errorPrefix = 'Request failed', timeout = 10000, ...init }: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      throw new Error(`${errorPrefix}: ${res.status} ${res.statusText}`);
    }
    return res;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`${errorPrefix}: Network error - please check your internet connection`);
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`${errorPrefix}: Request timed out - please try again`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Perform a GET request against the Quran.com API.
 *
 * @param path       Relative endpoint path.
 * @param params     Query parameters appended to the request.
 * @param errorPrefix Message prefix used if the request fails.
 *
 * Handles leading/trailing slashes, encodes query params, and throws when the
 * response is not OK.
 */
async function apiFetch<T>(
  path: string,
  params: Record<string, string> = {},
  errorPrefix = 'Failed to fetch'
): Promise<T> {
  const base = resolveBaseUrl();
  const url = new URL(path.replace(/^\//, ''), base);
  if (Object.keys(params).length) {
    const search = new URLSearchParams(params).toString().replace(/%2C/g, ',');
    url.search = search;
  }

  const res = await fetchWithTimeout(url.toString(), {
    // Avoid setting Content-Type on GET to prevent CORS preflight.
    // Use Accept to indicate we expect JSON.
    headers: {
      Accept: 'application/json',
    },
    errorPrefix,
  });

  return (await res.json()) as T;
}

export { API_BASE_URL, apiFetch, fetchWithTimeout };
