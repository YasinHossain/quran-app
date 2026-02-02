'use client';

import React from 'react';

import { SurahAudio } from '@/app/(features)/surah/components/surah-view/SurahAudio';

import { ThreeColumnWorkspace } from './ThreeColumnWorkspace';
import { WorkspaceMain } from './WorkspaceMain';

const useMinWidth = (minWidthPx: number): boolean => {
  const query = `(min-width: ${minWidthPx}px)`;

  return React.useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => {};
      }

      const mediaQueryList = window.matchMedia(query);
      const handleChange = () => callback();

      if (typeof mediaQueryList.addEventListener === 'function') {
        mediaQueryList.addEventListener('change', handleChange);
        return () => mediaQueryList.removeEventListener('change', handleChange);
      }

      // Safari < 14 fallback
      mediaQueryList.addListener(handleChange);
      return () => mediaQueryList.removeListener(handleChange);
    },
    () => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
      }
      return window.matchMedia(query).matches;
    },
    () => false
  );
};

export interface ReaderAudioProps {
  activeVerse: Parameters<typeof SurahAudio>[0]['activeVerse'];
  reciter: Parameters<typeof SurahAudio>[0]['reciter'];
  isVisible: Parameters<typeof SurahAudio>[0]['isVisible'];
  onNext: Parameters<typeof SurahAudio>[0]['onNext'];
  onPrev: Parameters<typeof SurahAudio>[0]['onPrev'];
}

interface WorkspaceReaderLayoutProps {
  main: React.ReactNode;
  desktopLeft: React.ReactNode;
  desktopRight: React.ReactNode;
  mobileLeft: React.ReactNode;
  mobileRight: React.ReactNode;
  audio: ReaderAudioProps;
  contentClassName?: string;
}

export const WorkspaceReaderLayout = ({
  main,
  desktopLeft,
  desktopRight,
  mobileLeft,
  mobileRight,
  audio,
  contentClassName,
}: WorkspaceReaderLayoutProps): React.JSX.Element => {
  const isXlUp = useMinWidth(1280);
  const is2xlUp = useMinWidth(1536);

  const shouldRenderMobileLeft = Boolean(mobileLeft && !isXlUp);
  const shouldRenderMobileRight = Boolean(mobileRight && !is2xlUp);
  const resolvedDesktopLeft = isXlUp ? desktopLeft : null;
  const resolvedDesktopRight = is2xlUp ? desktopRight : null;

  /*
   * PERF_FIX (2026-02-02)
   * {
   *   "problem": "CSS-only hiding (xl:hidden / 2xl:hidden) still mounted + hydrated both mobile drawer sidebars and desktop column sidebars.",
   *   "impact": "Hidden trees still run effects (SWR fetches, list rendering, settings hooks), hurting mobile Lighthouse (LCP/TBT).",
   *   "fix": "Gate rendering by media-query so only the active sidebar variant mounts."
   * }
   */
  return (
    <>
      {shouldRenderMobileLeft ? <div className="xl:hidden">{mobileLeft}</div> : null}

      {shouldRenderMobileRight ? <div className="2xl:hidden">{mobileRight}</div> : null}

      <ThreeColumnWorkspace
        left={resolvedDesktopLeft}
        center={
          <WorkspaceMain
            data-slot="surah-workspace-main"
            reserveLeftSpace
            reserveRightSpace
            contentClassName={contentClassName}
          >
            {main}
          </WorkspaceMain>
        }
        right={resolvedDesktopRight}
        leftContainerClassName="lg:py-0"
        rightContainerClassName="lg:py-0"
      />

      <SurahAudio
        activeVerse={audio.activeVerse}
        reciter={audio.reciter}
        isVisible={audio.isVisible}
        onNext={audio.onNext}
        onPrev={audio.onPrev}
      />
    </>
  );
};
