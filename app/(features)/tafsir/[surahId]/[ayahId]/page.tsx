import { getTafsirVersePageDataServer } from '@/lib/api/server';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import TafsirVersePageClient from './components/TafsirVersePageClient';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

export default async function TafsirVersePage({
  params,
}: TafsirVersePageProps): Promise<React.JSX.Element> {
  const { surahId, ayahId } = await params;
  const verseKey = `${surahId}:${ayahId}`;

  const DEFAULT_TRANSLATION_IDS = [20];
  const DEFAULT_WORD_LANG = ensureLanguageCode('en');
  const DEFAULT_TAFSIR_ID = 169;

  const { verse, tafsirHtml, tafsirResource } = await getTafsirVersePageDataServer({
    verseKey,
    tafsirId: DEFAULT_TAFSIR_ID,
    translationIds: DEFAULT_TRANSLATION_IDS,
    wordLang: DEFAULT_WORD_LANG,
    tajweed: false,
  });

  return (
    <TafsirVersePageClient
      surahId={surahId}
      ayahId={ayahId}
      initialVerse={verse}
      initialTafsirHtml={tafsirHtml}
      initialTafsirResource={tafsirResource}
    />
  );
}
