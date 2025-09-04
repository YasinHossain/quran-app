import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/app/providers/SidebarContext';
import type { Surah } from '@/types';
import { getSurahList } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

export const useVerseNavigation = (surahId: string, ayahId: string) => {
  const router = useRouter();
  const { setSurahListOpen } = useSidebar();

  const [surahList, setSurahList] = useState<Surah[]>([]);

  useEffect(() => {
    getSurahList()
      .then(setSurahList)
      .catch((err) => logger.error(err as Error));
  }, []);

  const totalSurahs = surahList.length;
  const currentSurahIndex = Number(surahId) - 1;
  const currentAyahNum = Number(ayahId);

  const prev =
    currentAyahNum > 1
      ? { surahId, ayahId: currentAyahNum - 1 }
      : currentSurahIndex > 0 && surahList.length > 0
        ? { surahId: String(Number(surahId) - 1), ayahId: surahList[currentSurahIndex - 1]!.verses }
        : null;

  const next =
    surahList.length > 0 && currentAyahNum < (surahList[currentSurahIndex]?.verses ?? 0)
      ? { surahId, ayahId: currentAyahNum + 1 }
      : currentSurahIndex < totalSurahs - 1
        ? { surahId: String(Number(surahId) + 1), ayahId: 1 }
        : null;

  const navigate = useCallback(
    (target: { surahId: string; ayahId: number } | null) => {
      if (!target) return;
      setSurahListOpen(false);
      router.push(`/tafsir/${target.surahId}/${target.ayahId}`);
    },
    [router, setSurahListOpen]
  );

  const currentSurah = useMemo(
    () => surahList.find((s) => s.number === Number(surahId)),
    [surahList, surahId]
  );

  return { prev, next, navigate, currentSurah };
};
