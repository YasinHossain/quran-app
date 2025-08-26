import type { Bookmark } from '@/domain/entities';
import { loadPinnedFromStorage, savePinnedToStorage } from './storage-utils';
import type { PinnedRepository } from '@/domain/repositories/PinnedRepository';

export class PinnedStorageRepository implements PinnedRepository {
  load(): Bookmark[] {
    return loadPinnedFromStorage();
  }

  save(bookmarks: Bookmark[]): void {
    savePinnedToStorage(bookmarks);
  }
}
