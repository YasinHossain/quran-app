import { parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Storage configuration segment.
 *
 * Governs access to browser storage mechanisms and quotas.
 */
export interface StorageConfig {
  enableIndexedDB: boolean;
  enableLocalStorage: boolean;
  storageQuota: number;
  autoCleanupDays: number;
}

const resolvePositiveNumber = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback;
  return value;
};

const resolveIntAtLeast = (value: number | undefined, fallback: number, min: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.trunc(value));
};

export const storageConfig: StorageConfig = {
  enableIndexedDB: parseBooleanEnv('STORAGE_ENABLE_INDEXEDDB', true),
  enableLocalStorage: parseBooleanEnv('STORAGE_ENABLE_LOCALSTORAGE', true),
  storageQuota: resolvePositiveNumber(parseNumberEnv('STORAGE_QUOTA_MB', 100), 100),
  autoCleanupDays: resolveIntAtLeast(parseNumberEnv('STORAGE_AUTO_CLEANUP_DAYS', 30), 30, 1),
};
