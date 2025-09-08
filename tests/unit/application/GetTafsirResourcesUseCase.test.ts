import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';
import { logger as Logger } from '@/src/infrastructure/monitoring/Logger';

const createRepository = (): jest.Mocked<ITafsirRepository> => ({
  getAllResources: jest.fn(),
  getResourcesByLanguage: jest.fn(),
  getById: jest.fn(),
  getTafsirByVerse: jest.fn(),
  search: jest.fn(),
  cacheResources: jest.fn(),
  getCachedResources: jest.fn(),
});

describe('GetTafsirResourcesUseCase', () => {
  let repository: jest.Mocked<ITafsirRepository>;
  let useCase: GetTafsirResourcesUseCase;
  const mockTafsirs = [
    new Tafsir({ id: 1, name: 'Tafsir One', lang: 'en' }),
    new Tafsir({ id: 2, name: 'Tafsir Two', lang: 'ar' }),
  ];

  beforeEach(() => {
    repository = createRepository();
    useCase = new GetTafsirResourcesUseCase(repository);
  });

  it('returns fresh resources when available', async () => {
    repository.getAllResources.mockResolvedValue(mockTafsirs);

    const result = await useCase.execute();

    expect(result).toEqual({ tafsirs: mockTafsirs, isFromCache: false });
    expect(repository.getCachedResources).not.toHaveBeenCalled();
  });

  it('returns error when both API and cache are empty', async () => {
    repository.getAllResources.mockResolvedValue([]);
    repository.getCachedResources.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(repository.getCachedResources).toHaveBeenCalled();
    expect(result).toEqual({
      tafsirs: [],
      isFromCache: false,
      error: 'No tafsir resources available. Please check your internet connection.',
    });
  });

  it('falls back to cached resources when API call fails', async () => {
    repository.getAllResources.mockRejectedValue(new Error('network'));
    repository.getCachedResources.mockResolvedValue(mockTafsirs);
    const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

    const result = await useCase.execute();

    expect(result).toEqual({ tafsirs: mockTafsirs, isFromCache: true });
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
