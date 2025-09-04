import { GetTafsirContentUseCase } from '../../../src/application/use-cases/GetTafsirContent';
import { ITafsirRepository } from '../../../src/domain/repositories/ITafsirRepository';

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

describe('GetTafsirContentUseCase', () => {
  let repository: jest.Mocked<ITafsirRepository>;
  let useCase: GetTafsirContentUseCase;

  beforeEach(() => {
    repository = createRepository();
    useCase = new GetTafsirContentUseCase(repository);
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

  it('throws user-friendly error when repository fails', async () => {
    repository.getTafsirByVerse.mockRejectedValue(new Error('Network error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(useCase.execute('1:1', 1)).rejects.toThrow(
      'Failed to load tafsir content. Please try again.'
    );
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('retrieves multiple tafsir contents with mixed results', async () => {
    repository.getTafsirByVerse
      .mockResolvedValueOnce('<p>tafsir 1</p>')
      .mockResolvedValueOnce('')
      .mockRejectedValueOnce(new Error('boom'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await useCase.executeMultiple('1:1', [1, 2, 3]);

    expect(result.get(1)).toBe('<p>tafsir 1</p>');
    expect(result.get(2)).toBe('No tafsir content available for this verse.');
    expect(result.get(3)).toBe('Failed to load tafsir content.');
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(3);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
