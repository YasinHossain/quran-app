import { z } from 'zod';

import { parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Storage configuration segment.
 *
 * Governs access to browser storage mechanisms and quotas.
 */
export const storageSchema = z.object({
  enableIndexedDB: z.boolean().default(true),
  enableLocalStorage: z.boolean().default(true),
  storageQuota: z.number().positive().default(100),
  autoCleanupDays: z.number().int().min(1).default(30),
});

export type StorageConfig = z.infer<typeof storageSchema>;

export const storageConfig: StorageConfig = {
  enableIndexedDB: parseBooleanEnv('STORAGE_ENABLE_INDEXEDDB', true),
  enableLocalStorage: parseBooleanEnv('STORAGE_ENABLE_LOCALSTORAGE', true),
  storageQuota: parseNumberEnv('STORAGE_QUOTA_MB', 100)!,
  autoCleanupDays: parseNumberEnv('STORAGE_AUTO_CLEANUP_DAYS', 30)!,
};
