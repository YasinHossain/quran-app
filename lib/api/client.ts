import { features } from '@/config';

// Default to the Quran.com QDC API (CORS-enabled); can be overridden via env.
const API_BASE_URL = process.env['QURAN_API_BASE_URL'] ?? 'https://api.qurancdn.com/api/qdc';

const PROXY_ROUTE_PATH = '/api/quran';
let memoizedServerProxyBase: string | null | undefined;

const DEFAULT_BROWSER_TIMEOUT_MS = 10_000;
const DEFAULT_SERVER_TIMEOUT_MS = 20_000;

const DEFAULT_TIMEOUT_MS = (() => {
  const envTimeout =
    process.env['NEXT_PUBLIC_QURAN_API_TIMEOUT'] ??
    process.env['QURAN_API_TIMEOUT'] ??
    process.env['API_TIMEOUT'];
  if (envTimeout !== undefined) {
    const parsed = Number.parseInt(envTimeout, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return typeof window === 'undefined' ? DEFAULT_SERVER_TIMEOUT_MS : DEFAULT_BROWSER_TIMEOUT_MS;
})();

const DEFAULT_RETRY_ATTEMPTS = (() => {
  const raw = process.env['QURAN_API_RETRY_ATTEMPTS'] ?? process.env['API_RETRY_ATTEMPTS'];
  if (raw !== undefined) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  // Only retry by default on the server to avoid double-fetching in the browser.
  return typeof window === 'undefined' ? 2 : 0;
})();

const DEFAULT_RETRY_DELAY_MS = (() => {
  const raw = process.env['QURAN_API_RETRY_DELAY'] ?? process.env['API_RETRY_DELAY'];
  if (raw !== undefined) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return 400;
})();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  /** When true, return the response even if it's not ok */
  allowNonOk?: boolean;
  /** Number of retry attempts for transient failures (timeouts, 429/5xx, network errors). */
  retryAttempts?: number;
  /** Base delay for retries (ms). Subsequent retries use exponential backoff. */
  retryDelayMs?: number;
}

function shouldRetryStatus(status: number): boolean {
  // 429: rate limit, 5xx: transient upstream failures.
  return status === 429 || status === 502 || status === 503 || status === 504;
}

function getRetryDelayMs(
  attempt: number,
  baseDelayMs: number,
  retryAfterHeader: string | null
): number {
  const backoff = baseDelayMs * Math.pow(2, attempt);

  // Respect Retry-After (seconds) when present, but clamp so we don't hang SSR forever.
  if (retryAfterHeader) {
    const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10);
    if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
      return Math.min(retryAfterSeconds * 1000, 2_000);
    }
  }

  // Add a little jitter to avoid stampedes.
  const jitter = Math.floor(Math.random() * 100);
  return Math.min(backoff + jitter, 2_000);
}

function normaliseFetchError(errorPrefix: string, error: unknown): Error {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new Error(`${errorPrefix}: Network error - please check your internet connection`);
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return new Error(`${errorPrefix}: Request timed out - please try again`);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(`${errorPrefix}: Unknown error`);
}

/**
 * Generic fetch wrapper that adds timeout handling and standardized error messages.
 */
async function fetchWithTimeout(
  url: string,
  {
    errorPrefix = 'Request failed',
    timeout = DEFAULT_TIMEOUT_MS,
    allowNonOk = false,
    retryAttempts = DEFAULT_RETRY_ATTEMPTS,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    ...init
  }: FetchWithTimeoutOptions = {}
): Promise<Response> {
  for (let attempt = 0; attempt <= retryAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if (!res.ok && !allowNonOk) {
        if (attempt < retryAttempts && shouldRetryStatus(res.status)) {
          const delayMs = getRetryDelayMs(attempt, retryDelayMs, res.headers.get('retry-after'));
          await sleep(delayMs);
          continue;
        }
        throw new Error(`${errorPrefix}: ${res.status} ${res.statusText}`);
      }
      return res;
    } catch (error) {
      const normalised = normaliseFetchError(errorPrefix, error);

      const isLastAttempt = attempt >= retryAttempts;
      const isRetryable =
        (normalised.message.includes('Request timed out') ||
          normalised.message.includes('Network error')) &&
        attempt < retryAttempts;

      if (!isLastAttempt && isRetryable) {
        const delayMs = getRetryDelayMs(attempt, retryDelayMs, null);
        await sleep(delayMs);
        continue;
      }

      throw normalised;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Unreachable, but satisfies TS return paths.
  throw new Error(`${errorPrefix}: Request failed`);
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
