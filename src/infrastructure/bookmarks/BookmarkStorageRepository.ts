import type { Folder } from '@/domain/entities';
import { loadBookmarksFromStorage, saveBookmarksToStorage } from './storage-utils';
import type { BookmarkRepository } from '@/domain/repositories/BookmarkRepository';

export class BookmarkStorageRepository implements BookmarkRepository {
  load(): Folder[] {
    return loadBookmarksFromStorage();
  }

  save(folders: Folder[]): void {
    saveBookmarksToStorage(folders);
  }
}
