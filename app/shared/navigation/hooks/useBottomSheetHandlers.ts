import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface BottomSheetHandlers {
  readonly handleSurahClick: (surahId: number) => void;
  readonly handleJuzClick: (juzNumber: number) => void;
  readonly handlePageClick: (page: number) => void;
}

export function useBottomSheetHandlers(
  onClose: () => void,
  onSurahSelect: (surahId: number) => void
): BottomSheetHandlers {
  const router = useRouter();

  const handleSurahClick = useCallback(
    (surahId: number) => {
      onSurahSelect(surahId);
      onClose();
    },
    [onSurahSelect, onClose]
  );

  const handleJuzClick = useCallback(
    (juzNumber: number) => {
      router.push(`/juz/${juzNumber}`);
      onClose();
    },
    [router, onClose]
  );

  const handlePageClick = useCallback(
    (page: number) => {
      router.push(`/page/${page}`);
      onClose();
    },
    [router, onClose]
  );

  return { handleSurahClick, handleJuzClick, handlePageClick } as const;
}
