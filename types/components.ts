import React from 'react';

/**
 * Common component prop interfaces to reduce duplication across the codebase
 */

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Search-related props
export interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

// Panel component props
export interface PanelComponentProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// List item props
export interface ListItemProps extends BaseComponentProps {
  icon?: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Card component props
export interface CardProps extends BaseComponentProps {
  onClick?: () => void;
  isActive?: boolean;
}

// Resource selection props
export interface ResourceSelectionProps<T> {
  items: T[];
  selectedId: string | number;
  onSelect: (id: string | number) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  loading?: boolean;
}

// Settings panel props
export interface SettingsPanelProps extends PanelComponentProps {
  settings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
}

// Modal props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Navigation item props
export interface NavigationItemProps extends BaseComponentProps {
  href?: string;
  icon?: React.ElementType;
  label: string;
  isActive?: boolean;
  count?: number;
}

// Action button props
export interface ActionButtonProps extends BaseComponentProps {
  icon: React.ElementType;
  label?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
