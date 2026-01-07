'use client';
import { useRouter } from 'next/navigation';

import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@/app/shared/icons';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { Surah } from '@/types';

import type { JSX } from 'react';

interface NavTarget {
  surahId: string;
  ayahId: number;
}

interface AyahNavigationProps {
  prev: NavTarget | null;
  next: NavTarget | null;
  navigate: (target: NavTarget | null) => void;
  currentSurah?: Surah | undefined;
  ayahId: string;
  surahId: string;
}

const ChevronLeft = (): JSX.Element => <ChevronLeftIcon size={20} className="text-accent" />;

const ChevronRight = (): JSX.Element => <ChevronRightIcon size={20} className="text-accent" />;

interface NavButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  side: 'left' | 'right';
}

const NavButton = ({ label, disabled, onClick, side }: NavButtonProps): JSX.Element => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="flex items-center px-1 py-2 sm:px-4 rounded-full bg-accent text-on-accent disabled:opacity-50 font-bold"
  >
    <div
      className={
        side === 'left'
          ? 'flex items-center justify-center w-9 h-9 rounded-full bg-surface mr-0 sm:mr-2'
          : 'flex items-center justify-center w-9 h-9 rounded-full bg-surface ml-0 sm:ml-2'
      }
    >
      {side === 'left' ? <ChevronLeft /> : <ChevronRight />}
    </div>
  </button>
);

const BackButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
  <button
    type="button"
    aria-label="Back"
    onClick={onClick}
    className="flex items-center px-1 sm:px-3 py-2 rounded-full bg-accent text-on-accent"
  >
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-surface">
      <ArrowLeftIcon size={18} className="text-accent" />
    </div>
  </button>
);

const Title = ({
  currentSurah,
  ayahId,
}: {
  currentSurah?: Surah | undefined;
  ayahId: string;
}): JSX.Element => (
  <div className="flex-1 min-w-0 text-center px-2 text-on-accent font-bold text-sm sm:text-base truncate">
    {currentSurah ? (
      <>
        <span className="font-bold">{currentSurah.name}</span> : {ayahId}
      </>
    ) : (
      ''
    )}
  </div>
);

export const AyahNavigation = ({
  prev,
  next,
  navigate,
  currentSurah,
  ayahId,
  surahId,
}: AyahNavigationProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between gap-1 sm:gap-3 rounded-full bg-accent text-on-accent p-2 min-w-0 overflow-hidden">
      <BackButton
        onClick={(): void => router.push(buildSurahRoute(surahId, { startVerse: ayahId }))}
      />
      <Title currentSurah={currentSurah} ayahId={ayahId} />
      <div className="flex items-center gap-1 sm:gap-3">
        <NavButton
          label="Previous"
          disabled={!prev}
          onClick={(): void => navigate(prev)}
          side="left"
        />
        <NavButton
          label="Next"
          disabled={!next}
          onClick={(): void => navigate(next)}
          side="right"
        />
      </div>
    </div>
  );
};
