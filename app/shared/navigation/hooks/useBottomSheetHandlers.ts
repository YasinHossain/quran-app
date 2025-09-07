import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useBottomSheetHandlers(
  onClose: () => void,
  onSurahSelect: (surahId: number) => void
) {
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
