import { useRef, type UIEvent } from 'react';

import {
  useSidebarScrollCentering,
  useBackgroundPreCentering,
} from './hooks/useSidebarScrollCentering';
import { useSidebarScrollPersistence } from './hooks/useSidebarScrollPersistence';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';

interface Options {
  activeTab: TabKey;
  selectedSurahId: number | null;
  selectedJuzId: number | null;
  selectedPageId: number | null;
  isEnabled: boolean;
}
export const useSidebarScroll = ({
  activeTab,
  selectedSurahId,
  selectedJuzId,
  selectedPageId,
  isEnabled,
}: Options): {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: (event: UIEvent<HTMLDivElement>) => void;
  prepareForTabSwitch: (nextTab: TabKey) => void;
  rememberScroll: (tab: TabKey) => void;
} => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    handleScroll,
    prepareForTabSwitch: persistencePrepare,
    rememberScroll: persistRemember,
  } = useSidebarScrollPersistence({ scrollRef, activeTab, isEnabled });
  const { skipNextCentering, prepareForTabSwitch: centeringPrepare } = useSidebarScrollCentering({
    scrollRef,
    activeTab,
    selectedSurahId,
    selectedJuzId,
    selectedPageId,
    isEnabled,
  });
  // Keep other tabs pre-centered in the background as selection changes
  useBackgroundPreCentering({ activeTab, selectedSurahId, selectedJuzId, selectedPageId });
  const rememberScroll = (tab: TabKey): void => {
    persistRemember(tab);
    skipNextCentering(tab);
  };
  const prepareForTabSwitch = (nextTab: TabKey): void => {
    persistencePrepare();
    centeringPrepare(nextTab);
  };
  return { scrollRef, handleScroll, prepareForTabSwitch, rememberScroll };
};
