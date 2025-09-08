import type { HookData, HookOptions } from '@/types';

export function getCachedData(key: string): HookData | null {
  try {
    const cached = localStorage.getItem(key);
    return cached ? (JSON.parse(cached) as HookData) : null;
  } catch {
    return null;
  }
}

export function setCachedData(key: string, data: HookData): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function clearCachedData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}

export function transformHookData(
  data: HookData,
): HookData {
  return data;
}

export function apiCall(
  id: string,
  options: HookOptions | undefined,
  config: { signal: AbortSignal },
): Promise<HookData> {
  return fetch(`/api/data/${id}`,
    { signal: config.signal, ...options?.fetchOptions }).then((res) => res.json());
}
