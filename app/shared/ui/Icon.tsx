'use client';

import React from 'react';
import {
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Languages,
  Menu,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Search,
  ArrowLeft,
  X,
  Home,
  Grid3X3,
  Check,
  Sun,
  Moon,
  Share,
  Clock,
  Pin,
  Folder,
  Plus,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  RotateCcw,
  Download,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Heart,
  Star,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const iconMap = {
  // Media controls
  play: Play,
  pause: Pause,
  'skip-back': SkipBack,
  'skip-forward': SkipForward,
  volume: Volume2,
  'volume-off': VolumeX,
  repeat: RotateCcw,

  // Navigation
  home: Home,
  'arrow-left': ArrowLeft,
  'chevron-down': ChevronDown,
  menu: Menu,
  grid: Grid3X3,

  // Actions
  bookmark: Bookmark,
  'bookmark-filled': BookmarkCheck,
  share: Share,
  download: Download,
  edit: Edit,
  delete: Trash2,
  copy: Copy,

  // Interface
  search: Search,
  close: X,
  check: Check,
  plus: Plus,
  more: MoreHorizontal,
  settings: Settings,
  filter: Filter,
  'sort-asc': SortAsc,
  'sort-desc': SortDesc,

  // Content
  'book-reader': BookOpen,
  translation: Languages,
  folder: Folder,
  pin: Pin,

  // Status
  heart: Heart,
  star: Star,
  info: Info,
  alert: AlertCircle,
  success: CheckCircle,
  error: XCircle,
  loading: Loader,
  refresh: RefreshCw,

  // Theme
  sun: Sun,
  moon: Moon,

  // Visibility
  eye: Eye,
  'eye-off': EyeOff,

  // Time
  clock: Clock,
} as const;

export type IconName = keyof typeof iconMap;

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * Unified Icon component using Lucide React icons
 * Provides a single interface for all icons used in the app
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={cn('flex-shrink-0', className)}
      aria-label={ariaLabel || name}
      {...props}
    />
  );
};

// Export individual icon components for backward compatibility
export const PlayIcon = (props: Omit<IconProps, 'name'>) => <Icon name="play" {...props} />;
export const PauseIcon = (props: Omit<IconProps, 'name'>) => <Icon name="pause" {...props} />;
export const BookmarkIcon = (props: Omit<IconProps, 'name'>) => <Icon name="bookmark" {...props} />;
export const BookmarkOutlineIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="bookmark" {...props} />
);
export const BookReaderIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="book-reader" {...props} />
);
export const TranslationIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="translation" {...props} />
);
export const BarsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="menu" {...props} />;
export const FontSettingIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="settings" {...props} />
);
export const ChevronDownIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="chevron-down" {...props} />
);
export const EllipsisHIcon = (props: Omit<IconProps, 'name'>) => <Icon name="more" {...props} />;
export const SearchSolidIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="search" {...props} />
);
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <Icon name="search" {...props} />;
export const ArrowLeftIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="arrow-left" {...props} />
);
export const CloseIcon = (props: Omit<IconProps, 'name'>) => <Icon name="close" {...props} />;
export const HomeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="home" {...props} />;
export const GridIcon = (props: Omit<IconProps, 'name'>) => <Icon name="grid" {...props} />;
export const CheckIcon = (props: Omit<IconProps, 'name'>) => <Icon name="check" {...props} />;
export const SunIcon = (props: Omit<IconProps, 'name'>) => <Icon name="sun" {...props} />;
export const MoonIcon = (props: Omit<IconProps, 'name'>) => <Icon name="moon" {...props} />;
export const ShareIcon = (props: Omit<IconProps, 'name'>) => <Icon name="share" {...props} />;
export const ClockIcon = (props: Omit<IconProps, 'name'>) => <Icon name="clock" {...props} />;
export const PinIcon = (props: Omit<IconProps, 'name'>) => <Icon name="pin" {...props} />;
export const FolderIcon = (props: Omit<IconProps, 'name'>) => <Icon name="folder" {...props} />;
export const PlusIcon = (props: Omit<IconProps, 'name'>) => <Icon name="plus" {...props} />;
