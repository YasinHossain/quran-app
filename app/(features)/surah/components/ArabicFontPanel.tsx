'use client';

import { useListHeight } from '@/app/shared/resource-panel/hooks/useListHeight';

import { ArabicFontContent } from './arabic-font-panel/ArabicFontContent';
import { ArabicFontHeader } from './arabic-font-panel/ArabicFontHeader';
import { useArabicFontPanel } from './panels/arabic-font-panel/useArabicFontPanel';

interface ArabicFontPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArabicFontPanel = ({ isOpen, onClose }: ArabicFontPanelProps): React.JSX.Element => {
  const panel = useArabicFontPanel();
  const { listContainerRef, listHeight } = useListHeight(isOpen);

  return (
    <div
      data-testid="arabic-font-panel"
      aria-hidden={!isOpen}
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-background text-foreground`}
    >
      <ArabicFontHeader onClose={onClose} onReset={panel.handleReset} />
      <ArabicFontContent
        panel={panel}
        listContainerRef={listContainerRef}
        listHeight={listHeight}
      />
    </div>
  );
};
