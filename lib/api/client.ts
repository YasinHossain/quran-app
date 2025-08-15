const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.quran.com/api/v4';

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
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`${errorPrefix}: ${res.status}`);
  }
  return (await res.json()) as T;
}

export { API_BASE_URL, apiFetch };
