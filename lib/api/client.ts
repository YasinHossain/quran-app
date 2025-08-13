const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.quran.com/api/v4';

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
