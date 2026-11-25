import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/app/providers/SettingsContext';
import { SITE_NAME } from '@/lib/seo/site';
import {
  buildTafsirMetadataText,
  DEFAULT_TAFSIR_METADATA_TEMPLATES,
  type TafsirMetadataTemplates,
} from '@/lib/seo/tafsirMetadata';

import type { Verse } from '@/types';
import type { i18n as I18n } from 'i18next';

const TEMPLATE_KEYS: Record<keyof TafsirMetadataTemplates, string> = {
  title: 'seo_tafsir_title',
  titleFallback: 'seo_tafsir_title_fallback',
  descriptionFallback: 'seo_tafsir_description_fallback',
  tail: 'seo_tafsir_description_tail',
  tailShort: 'seo_tafsir_description_tail_short',
  tafsirName: 'seo_default_tafsir_name',
};

/** A raw UI string (placeholders unfilled), falling back to English like the server translator. */
const readResource = (i18n: I18n, key: string): unknown =>
  i18n.getResource?.(i18n.language, 'translation', key) ??
  i18n.getResource?.('en', 'translation', key);

const readTemplates = (i18n: I18n): TafsirMetadataTemplates => {
  const templates = { ...DEFAULT_TAFSIR_METADATA_TEMPLATES };
  for (const field of Object.keys(TEMPLATE_KEYS) as Array<keyof TafsirMetadataTemplates>) {
    const value = readResource(i18n, TEMPLATE_KEYS[field]);
    if (typeof value === 'string') templates[field] = value;
  }
  return templates;
};

/** Same surah name as `ServerTranslator.chapterName`: English keeps the API's `name_simple`. */
const readChapterName = (i18n: I18n, surahId: string, simpleName: string | undefined): string => {
  const names = readResource(i18n, 'surah_names') as Record<string, string> | undefined;
  const localized = names?.[surahId];
  return (i18n.language === 'en' ? simpleName : localized) ?? localized ?? surahId;
};

/**
 * Keeps `document.title` in step with a verse switched to on the client (Next/Previous use
 * `pushState`, so Next's metadata does not change). Built like `generateMetadata` in `page.tsx`
 * plus the root layout's `%s | Site` template; the server-rendered verse gets its own title back.
 */
export function useTafsirDocumentTitle({
  verse,
  surahId,
  surahSimpleName,
  isServerVerse,
}: {
  verse: Verse | undefined;
  surahId: string;
  surahSimpleName: string | undefined;
  isServerVerse: boolean;
}): void {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const serverTitle = useRef<string | null>(null);
  const translationIds = settings.translationIds;

  useEffect(() => {
    if (isServerVerse) {
      if (serverTitle.current !== null) document.title = serverTitle.current;
      return;
    }
    // Captured on the first switch, once Next has applied the page metadata.
    serverTitle.current ??= document.title;
    if (!verse || !i18n) return;

    const translations = verse.translations;
    // Like the server: the first selected translation, or the Arabic text when there is none.
    const translationText = translationIds?.length
      ? (translations?.find((t) => t.resource_id === translationIds[0])?.text ??
        translations?.[0]?.text)
      : verse.text_uthmani;
    const { title } = buildTafsirMetadataText({
      chapterName: readChapterName(i18n, surahId, surahSimpleName),
      verseKey: verse.verse_key,
      translationText,
      templates: readTemplates(i18n),
    });
    document.title = `${title} | ${SITE_NAME}`;
  }, [i18n, isServerVerse, surahId, surahSimpleName, translationIds, verse]);
}
