'use client';

import React from 'react';

import { TafsirResource } from '@/types';

import { TafsirVirtualList } from './TafsirVirtualList';

export interface TafsirListProps {
  resources: TafsirResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  height: number;
  total: number;
}

export const TafsirList = ({
  resources,
  selectedIds,
  onToggle,
  height,
  total,
}: TafsirListProps): React.JSX.Element => (
  <TafsirVirtualList
    resources={resources}
    selectedIds={selectedIds}
    onToggle={onToggle}
    height={height}
    total={total}
  />
);
