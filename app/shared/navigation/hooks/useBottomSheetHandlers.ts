import { useCallback } from 'react';

import { useNavigationTargets } from '@/app/shared/navigation/hooks/useNavigationTargets';

export interface BottomSheetHandlers {
  readonly handleSurahClick: (surahId: number) => void;
  readonly handleJuzClick: (juzNumber: number) => void;
  readonly handlePageClick: (page: number) => void;
}

export function useBottomSheetHandlers(
  onClose: () => void,
  onSurahSelect: (surahId: number) => void
): BottomSheetHandlers {
  const { goToSurah, goToJuz, goToPage } = useNavigationTargets();

  const handleSurahClick = useCallback(
    (surahId: number) => {
      onSurahSelect(surahId);
      goToSurah(surahId);
      onClose();
    },
    [onSurahSelect, goToSurah, onClose]
  );

  const handleJuzClick = useCallback(
    (juzNumber: number) => {
      goToJuz(juzNumber);
      onClose();
    },
    [goToJuz, onClose]
  );

  const handlePageClick = useCallback(
    (page: number) => {
      goToPage(page);
      onClose();
    },
    [goToPage, onClose]
  );

  return { handleSurahClick, handleJuzClick, handlePageClick } as const;
}
