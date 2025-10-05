import { GetTafsirContentUseCase } from '@/src/application/use-cases/GetTafsirContent';
import {
  InvalidTafsirRequestError,
  TafsirContentLoadError,
} from '@/src/domain/errors/DomainErrors';
import { ILogger } from '@/src/domain/interfaces/ILogger';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';

// Minimal mocked repository implementing ITafsirRepository
const createRepository = (): jest.Mocked<ITafsirRepository> => ({
  getAllResources: jest.fn(),
  getResourcesByLanguage: jest.fn(),
  getById: jest.fn(),
  getTafsirByVerse: jest.fn(),
  search: jest.fn(),
  cacheResources: jest.fn(),
  getCachedResources: jest.fn(),
});

// Minimal mocked logger implementing ILogger
const createMockLogger = (): jest.Mocked<ILogger> => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
});

describe('GetTafsirContentUseCase', () => {
  let repository: jest.Mocked<ITafsirRepository>;
  let mockLogger: jest.Mocked<ILogger>;
  let useCase: GetTafsirContentUseCase;

  beforeEach(() => {
    repository = createRepository();
    mockLogger = createMockLogger();
    useCase = new GetTafsirContentUseCase(repository, mockLogger);
  });

  it('returns content when repository succeeds', async () => {
    repository.getTafsirByVerse.mockResolvedValue('<p>content</p>');

    const result = await useCase.execute('1:1', 1);

    expect(result).toBe('<p>content</p>');
    expect(repository.getTafsirByVerse).toHaveBeenCalledWith('1:1', 1);
  });

  it('returns fallback message when repository returns empty content', async () => {
    repository.getTafsirByVerse.mockResolvedValue('   ');

    const result = await useCase.execute('1:1', 1);

    expect(result).toBe('No tafsir content available for this verse.');
  });

  it('throws InvalidTafsirRequestError when parameters are missing', async () => {
    await expect(useCase.execute('', 0)).rejects.toThrow(InvalidTafsirRequestError);
  });

  it('throws TafsirContentLoadError when repository fails', async () => {
    repository.getTafsirByVerse.mockRejectedValue(new Error('Network error'));

    await expect(useCase.execute('1:1', 1)).rejects.toThrow(TafsirContentLoadError);
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to get tafsir content:',
      undefined,
      expect.any(Error)
    );
  });

  it('retrieves multiple tafsir contents with mixed results', async () => {
    repository.getTafsirByVerse
      .mockResolvedValueOnce('<p>tafsir 1</p>')
      .mockResolvedValueOnce('')
      .mockRejectedValueOnce(new Error('boom'));

    const result = await useCase.executeMultiple('1:1', [1, 2, 3]);

    expect(result.get(1)).toBe('<p>tafsir 1</p>');
    expect(result.get(2)).toBe('No tafsir content available for this verse.');
    expect(result.get(3)).toBe('Failed to load tafsir content.');
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(3);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Failed to get tafsir content for ID 3:',
      undefined,
      expect.any(Error)
    );
  });
});
