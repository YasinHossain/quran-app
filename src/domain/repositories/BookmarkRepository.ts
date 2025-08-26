import type { Folder } from '../entities';

export interface BookmarkRepository {
  load(): Folder[];
  save(folders: Folder[]): void;
}
