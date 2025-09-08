import { useState } from 'react';

export function usePlayerOptionsState(): {
  readonly mobileOptionsOpen: boolean;
  readonly setMobileOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly activeTab: 'reciter' | 'repeat';
  readonly setActiveTab: React.Dispatch<React.SetStateAction<'reciter' | 'repeat'>>;
} {
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');

  return {
    mobileOptionsOpen,
    setMobileOptionsOpen,
    activeTab,
    setActiveTab,
  } as const;
}
