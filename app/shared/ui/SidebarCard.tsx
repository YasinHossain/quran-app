import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface SidebarCardProps {
  href: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  scroll?: boolean;
  'data-active'?: boolean;
}

export const SidebarCard = ({
  href,
  isActive = false,
  onClick,
  children,
  className,
  scroll = false,
  'data-active': dataActive,
  ...props
}: SidebarCardProps) => {
  return (
    <Link
      href={href}
      scroll={scroll}
      data-active={dataActive}
      onClick={onClick}
      className={cn(
        'group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02]',
        isActive
          ? 'bg-accent text-on-accent shadow-lg shadow-accent/30'
          : 'bg-surface text-foreground shadow',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
