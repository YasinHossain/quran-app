import { loadLastReadFromStorage, saveLastReadToStorage } from './storage-utils';
import type { LastReadRepository } from '@/domain/repositories/LastReadRepository';

export class LastReadStorageRepository implements LastReadRepository {
  load(): Record<string, number> {
    return loadLastReadFromStorage();
  }

  save(lastRead: Record<string, number>): void {
    saveLastReadToStorage(lastRead);
  }
}
