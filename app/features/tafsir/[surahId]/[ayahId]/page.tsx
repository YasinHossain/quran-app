'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import AyahNavigation from './_components/AyahNavigation';
import VerseCard from './_components/VerseCard';
import TafsirTabs from './_components/TafsirTabs';
import { TafsirPanel } from '@/app/features/surah/[surahId]/_components/TafsirPanel';
import { getVersesByChapter } from '@/lib/api';
import { Verse as VerseType } from '@/types';
import { useSettings } from '@/app/context/SettingsContext';
import { useSidebar } from '@/app/context/SidebarContext';
import useSWR from 'swr';
import surahs from '@/data/surahs.json';

export default function TafsirVersePage() {
  const params = useParams<{ surahId: string; ayahId: string }>();
  const router = useRouter();
  const { settings } = useSettings();
  const { setSurahListOpen } = useSidebar();
  const { t } = useTranslation();
  const surahId = params.surahId;
  const ayahId = params.ayahId;
  // state for translation ID selection if needed in future
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = useState(false);

  // translation id from settings
  const translationId = settings.translationId;

  const { data: verseData } = useSWR(
    surahId && ayahId ? ['verse', surahId, ayahId, translationId, settings.wordLang] : null,
    ([, s, a, trId, wordLang]) =>
      getVersesByChapter(s, trId, Number(a), 1, wordLang).then((d) => d.verses[0])
  );
  const verse: VerseType | undefined = verseData;

  const totalSurahs = (surahs as { number: number; verses: number }[]).length;
  const currentSurahIndex = Number(surahId) - 1;
  const currentAyahNum = Number(ayahId);

  const prev =
    currentAyahNum > 1
      ? { surahId, ayahId: currentAyahNum - 1 }
      : currentSurahIndex > 0
        ? { surahId: String(Number(surahId) - 1), ayahId: surahs[currentSurahIndex - 1].verses }
        : null;

  const next =
    currentAyahNum < surahs[currentSurahIndex].verses
      ? { surahId, ayahId: currentAyahNum + 1 }
      : currentSurahIndex < totalSurahs - 1
        ? { surahId: String(Number(surahId) + 1), ayahId: 1 }
        : null;

  const navigate = (target: { surahId: string; ayahId: number } | null) => {
    if (!target) return;
    setSurahListOpen(false);
    router.push(`/features/tafsir/${target.surahId}/${target.ayahId}`);
  };

  return (
    <div className="flex flex-grow bg-slate-50 overflow-auto">
      <div className="flex-grow p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <AyahNavigation
            surahName={surahs[currentSurahIndex].name}
            verseNumber={currentAyahNum}
            onPrev={() => navigate(prev)}
            onNext={() => navigate(next)}
            prevDisabled={!prev}
            nextDisabled={!next}
          />

          {verse && <VerseCard verse={verse} />}
          <button
            onClick={() => setIsTafsirPanelOpen(true)}
            className="text-sm text-emerald-600 underline"
          >
            {t('select_tafsir')}
          </button>

          {verse && settings.tafsirIds.length > 0 && (
            <TafsirTabs verseKey={verse.verse_key} tafsirIds={settings.tafsirIds} />
          )}
        </div>
      </div>
      <TafsirPanel isOpen={isTafsirPanelOpen} onClose={() => setIsTafsirPanelOpen(false)} />
    </div>
  );
}
