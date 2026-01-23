'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { CloseIcon } from '@/app/shared/icons';
import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';
import { parseVerseKey } from '@/lib/utils/verse';

interface BottomSheetHeaderProps {
  verseKey: string;
  onClose: () => void;
}

export const BottomSheetHeader = memo(function BottomSheetHeader({
  verseKey,
  onClose,
}: BottomSheetHeaderProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  const { surahNumber, ayahNumber } = parseVerseKey(verseKey);

  const localizedVerseKey =
    surahNumber > 0 && ayahNumber > 0
      ? `${formatNumber(surahNumber, language, { useGrouping: false })}:${formatNumber(
          ayahNumber,
          language,
          { useGrouping: false }
        )}`
      : localizeDigits(verseKey, language);

  const fallbackSurahName =
    surahNumber > 0
      ? `${t('surah_tab')} ${formatNumber(surahNumber, language, { useGrouping: false })}`
      : t('surah_tab');

  const surahName =
    surahNumber > 0 ? t(`surah_names.${surahNumber}`, fallbackSurahName) : fallbackSurahName;

  const title = localizedVerseKey ? `${surahName} ${localizedVerseKey}` : surahName;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <button
        onClick={onClose}
        className={cn(
          'p-1.5 rounded-full hover:bg-interactive-hover transition-colors flex items-center justify-center',
          touchClasses.gesture,
          touchClasses.focus
        )}
        aria-label={t('close')}
      >
        <CloseIcon size={18} className="text-muted" />
      </button>
    </div>
  );
});
