// Prefer the CDN-backed QDC API for higher availability; can be overridden via env
const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.qurancdn.com/api/qdc';

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
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
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

