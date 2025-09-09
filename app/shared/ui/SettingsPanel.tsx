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

interface SettingsSectionHeaderProps {
  title: string;
}

const SettingsSectionHeader = memo(function SettingsSectionHeader({
  title,
}: SettingsSectionHeaderProps): React.JSX.Element {
  return (
    <h3 className="px-4 py-2 text-sm font-semibold text-muted uppercase tracking-wider">{title}</h3>
  );
});

interface SettingsItemRendererProps {
  item: SettingsPanelItem;
  index: number;
}

const SettingsItemRenderer = memo(function SettingsItemRenderer({
  item,
  index,
}: SettingsItemRendererProps): React.JSX.Element {
  switch (item.type) {
    case 'toggle': {
      const { type: _unusedType, ...props } = item;
      void _unusedType;
      return <ToggleSetting key={index} {...props} />;
    }
    case 'select': {
      const { type: _unusedType, ...props } = item;
      void _unusedType;
      return <SelectSetting key={index} {...props} />;
    }
    case 'range': {
      const { type: _unusedType, ...props } = item;
      void _unusedType;
      return <RangeSetting key={index} {...props} />;
    }
    case 'item': {
      const { type: _unusedType, children: itemChildren, ...props } = item;
      void _unusedType;
      return (
        <SettingItem key={index} {...props}>
          {itemChildren}
        </SettingItem>
      );
    }
    case 'custom':
    default:
      return <div key={index}>{item.element}</div>;
  }
});

interface SettingsSectionComponentProps {
  section: SettingsSection;
  index: number;
}

const SettingsSectionComponent = memo(function SettingsSectionComponent({
  section,
  index,
}: SettingsSectionComponentProps): React.JSX.Element {
  return (
    <div key={index} className="mb-6">
      {section.title && <SettingsSectionHeader title={section.title} />}
      <div className="bg-surface/50 rounded-lg mx-4 mb-4">
        {section.items.map((item, itemIndex) => (
          <SettingsItemRenderer key={itemIndex} item={item} index={itemIndex} />
        ))}
      </div>
    </div>
  );
});

interface SettingsActionsProps {
  actions: React.ReactNode[];
}

const SettingsActions = memo(function SettingsActions({
  actions,
}: SettingsActionsProps): React.JSX.Element | null {
  if (actions.length === 0) return null;

  return (
    <div className="border-t border-border p-4 space-y-2">
      {actions.map((action, index) => (
        <div key={index}>{action}</div>
      ))}
    </div>
  );
});

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
          <SettingsSectionComponent key={index} section={section} index={index} />
        ))}
        {children}
      </div>
      <SettingsActions actions={actions} />
    </Panel>
  );
});

export { SettingItem, ToggleSetting, SelectSetting, RangeSetting } from './settings';
