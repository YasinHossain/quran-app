import { cn } from '@/lib/utils/cn';

interface LayoutConfig {
  layout: 'flex' | 'block' | 'grid';
  direction: 'row' | 'column';
  align: string;
  justify: string;
  gap: string;
}

export function buildLayoutClasses({
  layout,
  direction,
  align,
  justify,
  gap,
}: LayoutConfig): string {
  return cn(
    layout === 'flex' && `flex items-${align}`,
    layout === 'flex' && direction === 'row' && `flex-row justify-${justify}`,
    layout === 'flex' && direction === 'column' && 'flex-col',
    layout === 'block' && 'block',
    layout === 'grid' && 'grid',
    gap
  );
}

export type { LayoutConfig };
