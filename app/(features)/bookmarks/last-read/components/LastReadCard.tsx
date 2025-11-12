'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { CircularProgress } from '@/app/(features)/bookmarks/components/CircularProgress';
import { Chapter } from '@/types';

interface LastReadCardProps {
  surahId: string;
  verseId: number;
  chapter?: Chapter;
  index: number;
}

export const LastReadCard = ({
  surahId,
  verseId,
  chapter,
  index,
}: LastReadCardProps): React.JSX.Element => {
  const router = useRouter();
  const total = chapter?.verses_count || 0;
  const percent = Math.min(100, Math.max(0, Math.round((verseId / total) * 100)));
  const isVisible = useMountVisible();
  const handleNavigate = React.useCallback((): void => {
    const params = new URLSearchParams({ startVerse: String(verseId) });
    router.push(`/surah/${surahId}?${params.toString()}`);
  }, [router, surahId, verseId]);

  const ariaLabel = `Continue reading ${chapter?.name_simple || `Surah ${surahId}`} at verse ${verseId}`;

  return (
    <CardContainer
      ariaLabel={ariaLabel}
      onActivate={handleNavigate}
      isVisible={isVisible}
      index={index}
    >
      <div className="flex w-full flex-1 items-center justify-center">
        <CircularProgress
          percentage={percent}
          label="Complete"
          size={100}
          strokeWidth={10}
          valueClassName="text-sm sm:text-base"
          labelClassName="text-[10px]"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm sm:text-base font-bold text-foreground truncate">
          {chapter?.name_simple || `Surah ${surahId}`}
        </p>
        <p className="text-[11px] sm:text-xs text-muted mt-1">
          Verse {verseId} of {total}
        </p>
      </div>
    </CardContainer>
  );
};

function CardContainer({
  ariaLabel,
  onActivate,
  isVisible,
  index,
  children,
}: {
  ariaLabel: string;
  onActivate: () => void;
  isVisible: boolean;
  index: number;
  children: React.ReactNode;
}): React.JSX.Element {
  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') onActivate();
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      className={`group flex h-full min-h-[10rem] sm:min-h-[11rem] lg:min-h-[12rem] w-full transform flex-col items-center justify-between rounded-2xl border border-border/50 bg-surface p-3 sm:p-4 lg:p-5 text-center shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${Math.min(index, 10) * 100}ms` }}
    >
      {children}
    </div>
  );
}

function useMountVisible(): boolean {
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => setIsVisible(true), []);
  return isVisible;
}
