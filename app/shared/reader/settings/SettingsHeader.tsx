'use client';

import React from 'react';

import { SidebarHeader } from '@/app/shared/components/SidebarHeader';

import type { ReactElement } from 'react';

interface SettingsHeaderProps {
  onClose: () => void;
}

export const SettingsHeader = ({ onClose }: SettingsHeaderProps): ReactElement => {
  return (
    <SidebarHeader
      title="Settings"
      onBack={onClose}
      showBackButton
      backButtonClassName="lg:hidden hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      backButtonAriaLabel="Close settings"
      titleClassName="text-mobile-lg font-semibold text-foreground"
    />
  );
};
