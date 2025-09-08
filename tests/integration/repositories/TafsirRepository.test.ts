import { apiFetch } from '@/lib/api/client';
import { logger, MemoryTransport, LogLevel } from '@/src/infrastructure/monitoring';
import { TafsirRepository } from '@/src/infrastructure/repositories/TafsirRepository';

jest.mock('../../../lib/api/client', () => ({
  apiFetch: jest.fn(),
  fetchWithTimeout: jest.fn(),
}));

describe('TafsirRepository logging', () => {
  let repository: TafsirRepository;
  let memory: MemoryTransport;

  beforeEach(() => {
    repository = new TafsirRepository();
    memory = new MemoryTransport();
    logger.addTransport(memory);
  });

  afterEach(() => {
    logger.removeTransport(memory);
    memory.clear();
    jest.clearAllMocks();
  });

  it('logs warning when primary tafsir API fails', async () => {
    (apiFetch as jest.Mock)
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ tafsir: { text: 'fallback' } });

    const text = await repository.getTafsirByVerse('1:1', 1);
    expect(text).toBe('fallback');

    const entries = memory.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(LogLevel.WARN);
    expect(entries[0].message).toBe('Primary tafsir API failed, trying fallback');
  });
});
