'use client';
import { Surah } from '@/types';

interface NavTarget {
  surahId: string;
  ayahId: number;
}

interface AyahNavigationProps {
  prev: NavTarget | null;
  next: NavTarget | null;
  navigate: (target: NavTarget | null) => void;
  currentSurah?: Surah;
  ayahId: string;
}

const ChevronLeft = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-accent"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M11.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L8.414 10l3.293 3.293a1 1 0 001.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRight = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-accent"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 10l-3.293-3.293a1 1 0 00-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

interface NavButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  side: 'left' | 'right';
}

const NavButton = ({ label, disabled, onClick, side }: NavButtonProps): JSX.Element => (
  <button
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="flex items-center px-3 py-2 sm:px-4 rounded-full bg-accent text-on-accent disabled:opacity-50 font-bold"
  >
    <div
      className={
        side === 'left'
          ? 'flex items-center justify-center w-8 h-8 rounded-full bg-surface mr-1 sm:mr-2'
          : 'flex items-center justify-center w-8 h-8 rounded-full bg-surface ml-1 sm:ml-2'
      }
    >
      {side === 'left' ? <ChevronLeft /> : <ChevronRight />}
    </div>
  </button>
);

const Title = ({ currentSurah, ayahId }: { currentSurah?: Surah; ayahId: string }): JSX.Element => (
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
}: AyahNavigationProps) => (
  <div className="flex w-full items-center justify-between gap-2 sm:gap-3 rounded-full bg-accent text-on-accent p-2 min-w-0 overflow-hidden">
    <NavButton label="Previous" disabled={!prev} onClick={() => navigate(prev)} side="left" />
    <Title currentSurah={currentSurah} ayahId={ayahId} />
    <NavButton label="Next" disabled={!next} onClick={() => navigate(next)} side="right" />
  </div>
);
