'use client';

import { motion } from 'framer-motion';
import { PlusIcon } from '@/app/shared/icons';

interface SimpleSectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  action?: {
    text: string;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
  };
  variant?: 'folder' | 'pinned' | 'lastRead';
}

export const SimpleSectionHeader = ({
  title,
  subtitle,
  count,
  action,
  variant = 'folder',
}: SimpleSectionHeaderProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'pinned':
        return {
          badge:
            'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
        };
      case 'lastRead':
        return {
          badge:
            'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
        };
      default: // folder
        return {
          badge:
            'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800',
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-primary  tracking-tight">{title}</h1>
            {count !== undefined && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full border ${variantClasses.badge}`}
              >
                {count}
              </motion.span>
            )}
          </div>
          {subtitle && <p className="text-muted  text-lg leading-relaxed max-w-2xl">{subtitle}</p>}
        </div>

        {action && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={action.onClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 focus:scale-105 bg-teal-600 hover:bg-teal-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40"
          >
            {action.icon && <action.icon size={16} />}
            {action.text}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
