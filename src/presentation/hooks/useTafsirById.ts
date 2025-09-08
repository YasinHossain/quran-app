import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { Tafsir } from '@/src/domain/entities/Tafsir';

import { useLoggedCallback } from './useLoggedCallback';

export const useTafsirById = (useCase: GetTafsirResourcesUseCase) =>
  useLoggedCallback((id: number) => useCase.getById(id), 'Error getting tafsir by ID', {
    defaultValue: null as Tafsir | null,
  });
