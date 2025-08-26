import type { Bookmark } from '../entities';

export interface PinnedRepository {
  load(): Bookmark[];
  save(bookmarks: Bookmark[]): void;
}
