import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/app/providers/SidebarContext';
import type { Surah } from '@/types';
import surahs from '@/data/surahs.json';

export const useVerseNavigation = (surahId: string, ayahId: string) => {
  const router = useRouter();
  const { setSurahListOpen } = useSidebar();

  const surahList = surahs as Surah[];
  const totalSurahs = surahList.length;
  const currentSurahIndex = Number(surahId) - 1;
  const currentAyahNum = Number(ayahId);

  const prev =
    currentAyahNum > 1
      ? { surahId, ayahId: currentAyahNum - 1 }
      : currentSurahIndex > 0
        ? { surahId: String(Number(surahId) - 1), ayahId: surahList[currentSurahIndex - 1].verses }
        : null;

  const next =
    currentAyahNum < surahList[currentSurahIndex].verses
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
