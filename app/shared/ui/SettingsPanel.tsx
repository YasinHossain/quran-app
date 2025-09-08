'use client';

import React, { memo } from 'react';

import { cn } from '@/lib/utils/cn';

import { Panel } from './Panel';
import {
  SettingItem,
  ToggleSetting,
  SelectSetting,
  RangeSetting,
  type SettingItemProps,
  type ToggleSettingProps,
  type SelectSettingProps,
  type RangeSettingProps,
} from './settings';

import type { SettingsPanelProps } from '@/types/components';

type SettingsPanelItem =
  | ({ type: 'toggle' } & ToggleSettingProps)
  | ({ type: 'select' } & SelectSettingProps)
  | ({ type: 'range' } & RangeSettingProps)
  | ({ type: 'item' } & SettingItemProps)
  | { type: 'custom'; element: React.ReactNode };

interface SettingsSection {
  title?: string;
  items: SettingsPanelItem[];
}

interface SettingsPanelComponentProps extends SettingsPanelProps {
  sections?: SettingsSection[];
  actions?: React.ReactNode[];
  children?: React.ReactNode;
}

export const SettingsPanel = memo(function SettingsPanel({
  isOpen,
  onClose,
  title = 'Settings',
  sections = [],
  actions = [],
  className,
  children,
}: SettingsPanelComponentProps): React.JSX.Element {
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
              {section.items.map((item, itemIndex) => {
                switch (item.type) {
                  case 'toggle': {
                    const { type: _unusedType, ...props } = item;
                    void _unusedType;
                    return <ToggleSetting key={itemIndex} {...props} />;
                  }
                  case 'select': {
                    const { type: _unusedType, ...props } = item;
                    void _unusedType;
                    return <SelectSetting key={itemIndex} {...props} />;
                  }
                  case 'range': {
                    const { type: _unusedType, ...props } = item;
                    void _unusedType;
                    return <RangeSetting key={itemIndex} {...props} />;
                  }
                  case 'item': {
                    const { type: _unusedType, children: itemChildren, ...props } = item;
                    void _unusedType;
                    return (
                      <SettingItem key={itemIndex} {...props}>
                        {itemChildren}
                      </SettingItem>
                    );
                  }
                  case 'custom':
                  default:
                    return <div key={itemIndex}>{item.element}</div>;
                }
              })}
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
});

export { SettingItem, ToggleSetting, SelectSetting, RangeSetting } from './settings';
