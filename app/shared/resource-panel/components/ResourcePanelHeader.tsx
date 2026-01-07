'use client';

import React from 'react';

import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { ResetIcon } from '@/app/shared/icons';

interface ResourcePanelHeaderProps {
  title: string;
  onClose: () => void;
  onReset?: () => void;
  onCloseSidebar?: () => void;
  backIconClassName?: string;
}

export const ResourcePanelHeader = ({
  title,
  onClose,
  onReset,
  onCloseSidebar,
}: ResourcePanelHeaderProps): React.JSX.Element => {
  return (
    <SidebarHeader
      title={title}
      onBack={onClose}
      showBackButton
      {...(onCloseSidebar ? { onClose: onCloseSidebar } : {})}
      showCloseButton={!!onCloseSidebar}
      forceVisible
      className="md:flex" // Ensure it shows on tablet/desktop if panels are used there, though panels are mostly mobile slide-overs or sidebars. SidebarHeader has 'md:hidden' by default unless forceVisible.
      // forceVisible overrides md:hidden in SidebarHeader implementation: !forceVisible && 'md:hidden'
    >
      {onReset && (
        <button
          onClick={onReset}
          className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-accent transition-colors text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center"
          title="Reset to Default"
        >
          <ResetIcon size={18} />
        </button>
      )}
    </SidebarHeader>
  );
};

export const SettingsPanelHeader = ResourcePanelHeader;
