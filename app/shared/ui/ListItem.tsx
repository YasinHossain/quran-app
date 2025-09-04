'use client';

import { cn } from '@/lib/utils/cn';
import type { ListItemProps, NavigationItemProps } from '@/types/components';

export const ListItem = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className,
  children,
}: ListItemProps): JSX.Element => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive ? 'bg-accent/20 text-accent' : 'text-foreground hover:bg-surface/50',
        onClick && 'cursor-pointer touch-manipulation',
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className="flex-1 truncate">{label}</span>
      {children}
    </Component>
  );
};

export const const NavigationItem = ({
  href,
  icon: Icon,
  label,
  isActive = false,
  count,
  className,
  children,
}: NavigationItemProps): JSX.Element => {
  const baseClasses = cn(
    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-accent/20 text-accent border border-accent/30'
      : 'text-foreground hover:bg-interactive/50',
    'touch-manipulation',
    className
  );

  const content = (
    <>
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="px-2 py-1 text-xs bg-surface/80 text-muted rounded-full">{count}</span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return <div className={baseClasses}>{content}</div>;
};
