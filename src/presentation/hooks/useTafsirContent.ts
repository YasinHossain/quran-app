import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';

import { useLoggedCallback } from './useLoggedCallback';

export const useTafsirContent = (useCase: GetTafsirResourcesUseCase) =>
  useLoggedCallback(
    (verseKey: string, tafsirId: number) => useCase.getTafsirContent(verseKey, tafsirId),
    'Error getting tafsir content',
    { rethrow: true }
  );
