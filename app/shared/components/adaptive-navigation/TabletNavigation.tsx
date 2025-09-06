'use client';

import React from 'react';

import { MobileNavigation } from './MobileNavigation';

import type { NavItem } from './types';

interface TabletNavigationProps {
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}

export const TabletNavigation = ({
  navItems,
  onItemClick,
  className,
}: TabletNavigationProps): React.JSX.Element => (
  <MobileNavigation navItems={navItems} onItemClick={onItemClick} className={className} />
);
