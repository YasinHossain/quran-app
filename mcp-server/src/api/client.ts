import fetch from 'node-fetch';

export const API_BASE_URL = 'https://api.quran.com/api/v4';

export interface ApiError {
  message: string;
  status?: number;
}

export async function apiFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  errorMessage = 'API request failed'
): Promise<T> {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`);
    }
    throw new Error(errorMessage);
  }
}
