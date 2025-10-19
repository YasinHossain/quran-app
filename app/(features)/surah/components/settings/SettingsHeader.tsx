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
      edgeToEdge
      withShadow={false}
      backButtonClassName="lg:hidden hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      backButtonAriaLabel="Close settings"
      titleClassName="text-mobile-lg font-semibold text-foreground"
      className="border-b border-border bg-background pt-safe lg:pt-2 shadow-none"
      contentClassName="h-16 lg:h-12 min-h-12 px-3 sm:px-4 py-0 sm:py-0"
    />
  );
};


