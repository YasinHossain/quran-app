'use client';
import React, { useState } from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SettingsSidebar } from '@/app/(features)/surah/components';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import { AyahNavigation } from './components/AyahNavigation';
import { TafsirAudioPlayer } from './components/TafsirAudioPlayer';
import { TafsirViewer } from './components/TafsirViewer';
import { useTafsirVerseData } from '../../hooks/useTafsirVerseData';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

export default function TafsirVersePage({ params }: TafsirVersePageProps): React.JSX.Element {
  const { surahId, ayahId } = React.use(params);
  const { isHidden } = useHeaderVisibility();
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

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  // Reciter is now coming from AudioContext

  // Match verse page behavior: keep body from scrolling and use internal scroll area
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <TafsirMain
        isHidden={isHidden}
        prev={prev}
        next={next}
        navigate={navigate}
        currentSurah={currentSurah}
        ayahId={ayahId}
        verse={verse}
        tafsirResource={tafsirResource}
        tafsirHtml={tafsirHtml}
      />

      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        onWordLanguagePanelOpen={() => setIsWordPanelOpen(true)}
        onTafsirPanelOpen={() => setIsTafsirPanelOpen(true)}
        selectedTranslationName={selectedTranslationName}
        selectedTafsirName={selectedTafsirName}
        selectedWordLanguageName={selectedWordLanguageName}
        showTafsirSetting
        isTranslationPanelOpen={isTranslationPanelOpen}
        onTranslationPanelClose={() => setIsTranslationPanelOpen(false)}
        isTafsirPanelOpen={isTafsirPanelOpen}
        onTafsirPanelClose={() => setIsTafsirPanelOpen(false)}
        isWordLanguagePanelOpen={isWordPanelOpen}
        onWordLanguagePanelClose={() => setIsWordPanelOpen(false)}
        pageType="tafsir"
      />

      <TafsirAudioPlayer activeVerse={activeVerse} reciter={reciter} isVisible={isPlayerVisible} />
    </>
  );
}

function TafsirMain({
  isHidden,
  prev,
  next,
  navigate,
  currentSurah,
  ayahId,
  verse,
  tafsirResource,
  tafsirHtml,
}: {
  isHidden: boolean;
  prev: { surahId: string; ayahId: number } | null;
  next: { surahId: string; ayahId: number } | null;
  navigate: (target: { surahId: string; ayahId: number } | null) => void;
  currentSurah: { number: number; verses: number; name: string } | undefined;
  ayahId: string;
  verse: Parameters<typeof TafsirViewer>[0]['verse'];
  tafsirResource: Parameters<typeof TafsirViewer>[0]['tafsirResource'];
  tafsirHtml: Parameters<typeof TafsirViewer>[0]['tafsirHtml'];
}): React.JSX.Element {
  return (
    <main className="h-screen text-foreground font-sans lg:mr-[20.7rem] overflow-hidden">
      <div
        className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
          isHidden
            ? 'pt-0'
            : 'pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]'
        }`}
      >
        <div className="w-full space-y-6 pt-4">
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
        </div>
      </div>
    </main>
  );
}
