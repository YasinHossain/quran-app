'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { EllipsisHIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

interface VerseActionTriggerProps {
  verseKey: string;
  onOpen: () => void;
  className?: string;
}

export const VerseActionTrigger = memo(function VerseActionTrigger({
  verseKey,
  onOpen,
  className = '',
}: VerseActionTriggerProps) {
  const { t, i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex-shrink-0 pl-1">
        <span className="font-semibold text-accent text-sm">
          {localizeDigits(verseKey, language)}
        </span>
      </div>
      <button
        onClick={onOpen}
        className={cn(
          'p-1.5 rounded-full hover:bg-interactive-hover transition-colors -mr-2 group flex items-center justify-center',
          touchClasses.target,
          touchClasses.gesture,
          touchClasses.focus
        )}
        aria-label={t('open_verse_actions_menu')}
      >
        <EllipsisHIcon size={18} className="text-muted group-hover:text-accent transition-colors" />
      </button>
    </div>
  );
});
