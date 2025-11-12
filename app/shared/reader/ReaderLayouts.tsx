'use client';

import React from 'react';

import { SurahAudio } from '@/app/(features)/surah/components/surah-view/SurahAudio';

import { ThreeColumnWorkspace } from './ThreeColumnWorkspace';
import { WorkspaceMain } from './WorkspaceMain';

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
}

export const WorkspaceReaderLayout = ({
  main,
  desktopLeft,
  desktopRight,
  mobileLeft,
  mobileRight,
  audio,
}: WorkspaceReaderLayoutProps): React.JSX.Element => (
  <>
    <div className="lg:hidden">
      {mobileLeft}
      {mobileRight}
    </div>

    <ThreeColumnWorkspace
      left={desktopLeft}
      center={
        <WorkspaceMain data-slot="surah-workspace-main" reserveLeftSpace reserveRightSpace>
          {main}
        </WorkspaceMain>
      }
      right={desktopRight}
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
