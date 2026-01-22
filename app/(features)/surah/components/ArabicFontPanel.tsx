'use client';

import { SlideOverPanel } from '@/app/shared/components/SlideOverPanel';
import { SettingsPanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';
import { useListHeight } from '@/app/shared/resource-panel/hooks/useListHeight';

import { ArabicFontContent } from './arabic-font-panel/ArabicFontContent';
import { useArabicFontPanel } from './panels/arabic-font-panel/useArabicFontPanel';

interface ArabicFontPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseSidebar?: () => void;
}

export const ArabicFontPanel = ({
  isOpen,
  onClose,
  onCloseSidebar,
}: ArabicFontPanelProps): React.JSX.Element => {
  return (
    <SlideOverPanel isOpen={isOpen} testId="arabic-font-panel">
      <ArabicFontPanelBody onClose={onClose} {...(onCloseSidebar ? { onCloseSidebar } : {})} />
    </SlideOverPanel>
  );
};

function ArabicFontPanelBody({
  onClose,
  onCloseSidebar,
}: {
  onClose: () => void;
  onCloseSidebar?: () => void;
}): React.JSX.Element {
  const panel = useArabicFontPanel();
  const { listContainerRef, listHeight } = useListHeight(true);

  return (
    <>
      <SettingsPanelHeader
        title="Arabic Font Selection"
        onClose={onClose}
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
        backIconClassName="h-6 w-6 text-foreground"
      />
      <ArabicFontContent
        panel={panel}
        listContainerRef={listContainerRef}
        listHeight={listHeight}
      />
    </>
  );
}
