import { logger, MemoryTransport, LogLevel } from '@/src/infrastructure/monitoring/Logger';
import { BookmarkRepository } from '@/src/infrastructure/repositories/BookmarkRepository';

import type { StoredBookmark } from '@/src/domain/value-objects/StoredBookmark';

describe('BookmarkRepository logging', () => {
  let repository: BookmarkRepository;
  let memory: MemoryTransport;

  beforeEach(() => {
    repository = new BookmarkRepository();
    memory = new MemoryTransport();
    logger.addTransport(memory);
  });

  afterEach(() => {
    logger.removeTransport(memory);
    memory.clear();
  });

  it('logs warning for invalid import data', async () => {
    await repository.importBookmarks('user1', [{} as unknown as StoredBookmark]);

    const entries = memory.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(LogLevel.WARN);
    expect(entries[0].message).toBe('Invalid bookmark data for import');
  });

  it('logs info when caching for offline use', async () => {
    await repository.cacheForOffline('user1');

    const entries = memory.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(LogLevel.INFO);
    expect(entries[0].message).toBe('Bookmarks already cached offline');
    expect(entries[0].context).toEqual({ userId: 'user1' });
  });
});
