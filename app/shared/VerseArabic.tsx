'use client';
import { Verse as VerseType, Word } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';
import { applyTajweed } from '@/lib/text/tajweed';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import type { LanguageCode } from '@/lib/text/languageCodes';

interface VerseArabicProps {
  verse: VerseType;
}

const VerseArabic = ({ verse }: VerseArabicProps) => {
  const { settings } = useSettings();
  const showByWords = settings.showByWords ?? false;
  const wordLang = settings.wordLang ?? 'en';

  return (
    <p
      dir="rtl"
      className="text-right leading-loose text-foreground"
      style={{
        fontFamily: settings.arabicFontFace,
        fontSize: `${settings.arabicFontSize}px`,
        lineHeight: 2.2,
      }}
    >
      {verse.words && verse.words.length > 0 ? (
        <span className="flex flex-wrap gap-x-3 gap-y-1 justify-start">
          {verse.words.map((word: Word) => (
            <span key={word.id} className="text-center">
              <span className="relative group cursor-pointer inline-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                      settings.tajweed ? applyTajweed(word.uthmani) : word.uthmani
                    ),
                  }}
                />
                {!showByWords && (
                  <span className="absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:block bg-surface text-foreground text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                    {word[wordLang as LanguageCode] as string}
                  </span>
                )}
              </span>
              {showByWords && (
                <span
                  className="mt-0.5 block text-muted mx-1"
                  style={{ fontSize: `${settings.arabicFontSize * 0.5}px` }}
                >
                  {word[wordLang as LanguageCode] as string}
                </span>
              )}
            </span>
          ))}
        </span>
      ) : settings.tajweed ? (
        <span
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(applyTajweed(verse.text_uthmani)),
          }}
        />
      ) : (
        verse.text_uthmani
      )}
    </p>
  );
};

export default VerseArabic;
