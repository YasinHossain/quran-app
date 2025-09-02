// Prefer the CDN-backed QDC API for higher availability; can be overridden via env
const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.qurancdn.com/api/qdc';

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

  try {
    // Create timeout controller for better browser compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url.toString(), {
      // Avoid setting Content-Type on GET to prevent CORS preflight.
      // Use Accept to indicate we expect JSON.
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`${errorPrefix}: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    // Handle specific error types
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`${errorPrefix}: Network error - please check your internet connection`);
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`${errorPrefix}: Request timed out - please try again`);
    }
    // Re-throw other errors as-is
    throw error;
  }
}

export { API_BASE_URL, apiFetch };
