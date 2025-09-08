export interface Transport {
  endpoint: string;
  headers: Record<string, string>;
}

export function createTransport(endpoint: string, apiKey?: string): Transport {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return {
    endpoint,
    headers,
  };
}
