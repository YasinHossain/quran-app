'use client';
import React from 'react';

import { SettingsSidebar } from '@/app/(features)/surah/components';
import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { useTafsirVerseData } from '@/app/(features)/tafsir/hooks/useTafsirVerseData';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';
import { Surah } from '@/types';

import { AyahNavigation } from './components/AyahNavigation';
import { TafsirAudioPlayer } from './components/TafsirAudioPlayer';
import { TafsirViewer } from './components/TafsirViewer';
import { TafsirWorkspaceSettings } from './components/TafsirWorkspaceSettings';
import { useBodyScrollLock, usePanelsState } from './useTafsirPanels';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

export default function TafsirVersePage({ params }: TafsirVersePageProps): React.JSX.Element {
  const { surahId, ayahId } = React.use(params);
  const { activeVerse, isPlayerVisible, reciter } = useAudio();
  const {
    verse,
    tafsirHtml,
    tafsirResource,
    selectedTranslationName,
    selectedTafsirName,
    selectedWordLanguageName,
    prev,
    next,
    navigate,
    currentSurah,
  } = useTafsirVerseData(surahId, ayahId);

  const panels = usePanelsState();
  useBodyScrollLock();

  return (
    <>
      <div className="lg:hidden">
        <SurahListSidebar />
        <TafsirSettingsSidebar
          panels={panels}
          selectedTranslationName={selectedTranslationName}
          selectedTafsirName={selectedTafsirName}
          selectedWordLanguageName={selectedWordLanguageName}
        />
      </div>

      <ThreeColumnWorkspace
        left={<SurahWorkspaceNavigation />}
        center={
          <WorkspaceMain data-slot="tafsir-workspace-main" contentClassName="pt-4">
            <TafsirContent
              prev={prev}
              next={next}
              navigate={navigate}
              currentSurah={currentSurah}
              ayahId={ayahId}
              verse={verse}
              tafsirResource={tafsirResource}
              tafsirHtml={tafsirHtml}
            />
          </WorkspaceMain>
        }
        right={
          <TafsirWorkspaceSettings
            selectedTranslationName={selectedTranslationName}
            selectedTafsirName={selectedTafsirName}
            selectedWordLanguageName={selectedWordLanguageName}
            isTranslationPanelOpen={panels.isTranslationPanelOpen}
            onTranslationPanelOpen={panels.openTranslationPanel}
            onTranslationPanelClose={panels.closeTranslationPanel}
            isTafsirPanelOpen={panels.isTafsirPanelOpen}
            onTafsirPanelOpen={panels.openTafsirPanel}
            onTafsirPanelClose={panels.closeTafsirPanel}
            isWordLanguagePanelOpen={panels.isWordPanelOpen}
            onWordLanguagePanelOpen={panels.openWordPanel}
            onWordLanguagePanelClose={panels.closeWordPanel}
          />
        }
      />

      <TafsirAudioPlayer activeVerse={activeVerse} reciter={reciter} isVisible={isPlayerVisible} />
    </>
  );
}

function TafsirContent({
  prev,
  next,
  navigate,
  currentSurah,
  ayahId,
  verse,
  tafsirResource,
  tafsirHtml,
}: {
  prev: { surahId: string; ayahId: number } | null;
  next: { surahId: string; ayahId: number } | null;
  navigate: (target: { surahId: string; ayahId: number } | null) => void;
  currentSurah: Surah | undefined;
  ayahId: string;
  verse: Parameters<typeof TafsirViewer>[0]['verse'];
  tafsirResource: Parameters<typeof TafsirViewer>[0]['tafsirResource'];
  tafsirHtml: Parameters<typeof TafsirViewer>[0]['tafsirHtml'];
}): React.JSX.Element {
  return (
    <>
      <AyahNavigation
        prev={prev}
        next={next}
        navigate={navigate}
        {...(currentSurah !== undefined ? { currentSurah } : {})}
        ayahId={ayahId}
      />
      <TafsirViewer
        {...(verse !== undefined ? { verse } : {})}
        {...(tafsirResource !== undefined ? { tafsirResource } : {})}
        {...(tafsirHtml !== undefined ? { tafsirHtml } : {})}
      />
    </>
  );
}

function TafsirSettingsSidebar({
  panels,
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
}: {
  panels: ReturnType<typeof usePanelsState>;
  selectedTranslationName: string;
  selectedTafsirName: string;
  selectedWordLanguageName: string;
}): React.JSX.Element {
  return (
    <SettingsSidebar
      onTranslationPanelOpen={panels.openTranslationPanel}
      onWordLanguagePanelOpen={panels.openWordPanel}
      onTafsirPanelOpen={panels.openTafsirPanel}
      selectedTranslationName={selectedTranslationName}
      selectedTafsirName={selectedTafsirName}
      selectedWordLanguageName={selectedWordLanguageName}
      showTafsirSetting
      isTranslationPanelOpen={panels.isTranslationPanelOpen}
      onTranslationPanelClose={panels.closeTranslationPanel}
      isTafsirPanelOpen={panels.isTafsirPanelOpen}
      onTafsirPanelClose={panels.closeTafsirPanel}
      isWordLanguagePanelOpen={panels.isWordPanelOpen}
      onWordLanguagePanelClose={panels.closeWordPanel}
      pageType="tafsir"
    />
  );
}
