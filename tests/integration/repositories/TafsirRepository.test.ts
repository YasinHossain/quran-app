import { TafsirRepository } from '../../../src/infrastructure/repositories/TafsirRepository';
import {
  logger,
  MemoryTransport,
  LogLevel,
} from '../../../src/infrastructure/monitoring/Logger';
import { apiFetch } from '../../../lib/api/client';

jest.mock('../../../lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

describe('TafsirRepository logging', () => {
  let repository: TafsirRepository;
  let memory: MemoryTransport;
  const originalFetch = global.fetch;

  beforeEach(() => {
    repository = new TafsirRepository();
    memory = new MemoryTransport();
    logger.addTransport(memory);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tafsir: { text: 'fallback' } }),
    }) as any;
  });

  afterEach(() => {
    logger.removeTransport(memory);
    memory.clear();
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('logs warning when primary tafsir API fails', async () => {
    (apiFetch as jest.Mock).mockRejectedValue(new Error('network'));

    const text = await repository.getTafsirByVerse('1:1', 1);
    expect(text).toBe('fallback');

    const entries = memory.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(LogLevel.WARN);
    expect(entries[0].message).toBe(
      'Primary tafsir API failed, trying fallback'
    );
  });
});
