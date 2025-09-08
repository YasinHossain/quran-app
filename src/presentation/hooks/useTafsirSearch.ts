import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { Tafsir } from '@/src/domain/entities/Tafsir';

import { useLoggedCallback } from './useLoggedCallback';

export const useTafsirSearch = (
  useCase: GetTafsirResourcesUseCase
): ((searchTerm: string) => Promise<Tafsir[]>) =>
  useLoggedCallback((searchTerm: string) => useCase.search(searchTerm), 'Error searching tafsirs', {
    defaultValue: [] as Tafsir[],
  });
