'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

import { Panel } from './Panel';
import { SettingItem, ToggleSetting, SelectSetting, RangeSetting } from './settings';

import type { SettingsPanelProps } from '@/types/components';

interface SettingsPanelComponentProps extends SettingsPanelProps {
  sections?: Array<{
    title?: string;
    items: React.ReactNode[];
  }>;
  actions?: React.ReactNode[];
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  title = 'Settings',
  sections = [],
  actions = [],
  className,
  children,
}: SettingsPanelComponentProps): React.JSX.Element => {
  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="sidebar"
      className={cn('flex flex-col h-full', className)}
    >
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            {section.title && (
              <h3 className="px-4 py-2 text-sm font-semibold text-muted uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="bg-surface/50 rounded-lg mx-4 mb-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>{item}</div>
              ))}
            </div>
          </div>
        ))}
        {children}
      </div>

      {actions.length > 0 && (
        <div className="border-t border-border p-4 space-y-2">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </Panel>
  );
};

export { SettingItem, ToggleSetting, SelectSetting, RangeSetting };
