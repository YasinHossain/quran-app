'use client';

import React from 'react';

export interface SortDropdownProps {
  sortBy: 'recent' | 'name-asc' | 'name-desc' | 'most-verses';
  onSortChange: (sort: 'recent' | 'name-asc' | 'name-desc' | 'most-verses') => void;
}

export const SortDropdown = ({ sortBy, onSortChange }: SortDropdownProps): React.JSX.Element => (
  <div className="flex-shrink-0">
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
      className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent shadow-sm hover:shadow-md transition-all duration-200"
    >
      <option value="recent">Recent</option>
      <option value="name-asc">A–Z</option>
      <option value="name-desc">Z–A</option>
      <option value="most-verses">Most verses</option>
    </select>
  </div>
);

