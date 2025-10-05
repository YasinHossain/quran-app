import { motion } from 'framer-motion';
import { memo } from 'react';

interface NavigationItemProps {
  number: number;
  title: string;
  subtitle?: string;
  arabicName?: string;
  onClick: () => void;
}

export const NavigationItem = memo(function NavigationItem({
  number,
  title,
  subtitle,
  arabicName,
  onClick,
}: NavigationItemProps): React.JSX.Element {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-interactive transition-all duration-200 text-left group touch-manipulation"
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center font-semibold text-sm group-hover:bg-accent group-hover:text-on-accent transition-colors">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
            {title}
          </h3>
          {arabicName && <span className="text-xl text-accent/70 font-arabic">{arabicName}</span>}
        </div>
        {subtitle && (
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
});
