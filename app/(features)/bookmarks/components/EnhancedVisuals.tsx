'use client';

import { motion } from 'framer-motion';
import { FolderIcon, BookmarkIcon, PinIcon, ClockIcon, EllipsisHIcon } from '@/app/shared/icons';
import { patterns, componentClasses, colorSchemes, utils } from '@/app/shared/design-system';

// Use centralized color schemes from design system

// Enhanced section headers with improved typography
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  action?: {
    text: string;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
  };
  colorScheme?: keyof typeof colorSchemes;
}

export const SectionHeader = ({
  title,
  subtitle,
  count,
  action,
  colorScheme = 'folder',
}: SectionHeaderProps) => {
  const scheme = utils.getColorScheme(colorScheme);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={patterns.sectionHeader()}
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className={utils.cn(componentClasses.text.heading, 'text-3xl tracking-tight')}>
              {title}
            </h1>
            {count !== undefined && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={utils.cn(
                  'inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full border',
                  scheme.bg,
                  scheme.text,
                  scheme.border
                )}
              >
                {count}
              </motion.span>
            )}
          </div>
          {subtitle && (
            <p
              className={utils.cn(componentClasses.text.muted, 'text-lg leading-relaxed max-w-2xl')}
            >
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={action.onClick}
            className={utils.cn(
              componentClasses.button.primary,
              'gap-2 py-2.5 rounded-xl transform hover:scale-105 focus:scale-105',
              'shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40'
            )}
          >
            {action.icon && <action.icon size={16} />}
            {action.text}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced folder card with better visual hierarchy
interface EnhancedFolderCardProps {
  name: string;
  count: number;
  onClick: () => void;
  color?: string;
  preview?: string[];
  lastModified?: string;
}

export const EnhancedFolderCard = ({
  name,
  count,
  onClick,
  color,
  preview,
  lastModified,
}: EnhancedFolderCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={patterns.card('folder')}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <FolderIcon size={24} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className={utils.cn(componentClasses.text.heading, 'text-lg line-clamp-1')}>
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {count} {count === 1 ? 'bookmark' : 'bookmarks'}
            </p>
          </div>
        </div>

        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full p-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisHIcon size={18} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div className="mb-4 space-y-1">
          {preview.slice(0, 2).map((text, index) => (
            <div
              key={index}
              className={utils.cn(
                componentClasses.text.caption,
                'line-clamp-1 px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded'
              )}
            >
              {text}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {lastModified && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Updated {lastModified}</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 2 }}
            className="text-teal-600 dark:text-teal-400"
          >
            →
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// Enhanced sidebar navigation item
interface SidebarNavItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  isActive: boolean;
  count?: number;
  onClick: () => void;
  colorScheme?: keyof typeof colorSchemes;
}

export const SidebarNavItem = ({
  icon: Icon,
  label,
  isActive,
  count,
  onClick,
  colorScheme = 'folder',
}: SidebarNavItemProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={patterns.navItem(isActive, colorScheme)}
    >
      <div
        className={utils.cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
          isActive ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-100 dark:bg-gray-700'
        )}
      >
        <Icon
          size={20}
          className={
            isActive ? utils.getColorScheme(colorScheme).icon : 'text-gray-500 dark:text-gray-400'
          }
        />
      </div>

      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <span
            className={utils.cn(
              'font-medium',
              isActive ? componentClasses.text.body : componentClasses.text.muted
            )}
          >
            {label}
          </span>
          {count !== undefined && count > 0 && (
            <span
              className={utils.cn(
                'text-xs px-2 py-1 rounded-full',
                isActive
                  ? utils.cn(utils.getColorScheme(colorScheme).text, 'bg-white dark:bg-gray-800')
                  : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
              )}
            >
              {count}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};
