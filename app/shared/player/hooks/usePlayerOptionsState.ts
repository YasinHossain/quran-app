import { useState } from 'react';

export function usePlayerOptionsState() {
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');

  return {
    mobileOptionsOpen,
    setMobileOptionsOpen,
    activeTab,
    setActiveTab,
  } as const;
}
