'use client';
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Verse as VerseComponent } from '@/app/features/surah/[surahId]/_components/Verse';
import { CollapsibleSection } from '@/app/features/surah/[surahId]/_components/CollapsibleSection';
import {
  getVersesByChapter,
  getTranslations,
  getTafsirResources,
  getTafsirByVerse,
} from '@/lib/api';
import { Verse as VerseType, TranslationResource, TafsirResource } from '@/types';
import { useSettings } from '@/app/context/SettingsContext';
import { useSidebar } from '@/app/context/SidebarContext';
import useSWR from 'swr';
import surahs from '@/data/surahs.json';

export default function TafsirVersePage() {
  const params = useParams<{ surahId: string; ayahId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { setSurahListOpen } = useSidebar();
  const surahId = params.surahId;
  const ayahId = params.ayahId;

  const { data: translationOptionsData } = useSWR('translations', getTranslations);
  const translationOptions: TranslationResource[] = useMemo(
    () => translationOptionsData || [],
    [translationOptionsData]
  );

  const { data: tafsirOptionsData } = useSWR('tafsirs', getTafsirResources);
  const tafsirOptions: TafsirResource[] = useMemo(
    () => tafsirOptionsData || [],
    [tafsirOptionsData]
  );

  const [translationId, setTranslationId] = useState(settings.translationId);
  const [tafsirLang, setTafsirLang] = useState('english');

  const tafsirResource = useMemo(
    () => tafsirOptions.find((t) => t.language_name === tafsirLang),
    [tafsirOptions, tafsirLang]
  );

  const { data: verseData } = useSWR(
    surahId && ayahId ? ['verse', surahId, ayahId, translationId, settings.wordLang] : null,
    ([, s, a, trId, wordLang]) =>
      getVersesByChapter(s, trId, Number(a), 1, wordLang).then((d) => d.verses[0])
  );
  const verse: VerseType | undefined = verseData;

  const { data: tafsirText } = useSWR(
    verse && tafsirResource ? ['tafsir', verse.verse_key, tafsirResource.id] : null,
    ([, key, id]) => getTafsirByVerse(key as string, id as number)
  );

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

  const tafsirLanguages = useMemo(
    () => Array.from(new Set(tafsirOptions.map((t) => t.language_name))),
    [tafsirOptions]
  );

  return (
    <div className="flex-grow overflow-y-auto p-6 lg:p-10 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between">
          <button
            disabled={!prev}
            onClick={() => navigate(prev)}
            className="px-3 py-1 rounded bg-teal-600 text-white disabled:opacity-50"
          >
            {t('previous_ayah')}
          </button>
          <button
            disabled={!next}
            onClick={() => navigate(next)}
            className="px-3 py-1 rounded bg-teal-600 text-white disabled:opacity-50"
          >
            {t('next_ayah')}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <select
              className="border p-2 rounded"
              value={translationId}
              onChange={(e) => setTranslationId(Number(e.target.value))}
            >
              {translationOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              className="border p-2 rounded"
              value={tafsirLang}
              onChange={(e) => setTafsirLang(e.target.value)}
            >
              {tafsirLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {verse && <VerseComponent verse={verse} />}

          {tafsirResource && (
            <CollapsibleSection
              key={verse?.verse_key}
              title={tafsirResource.name}
              icon={<></>}
              isLast
            >
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: tafsirText || '' }}
              />
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}
