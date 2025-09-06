import type { TablerIcon } from '@tabler/icons-react';

export interface NavItem {
  id: string;
  icon: TablerIcon;
  label: string;
  href?: string;
  isActive?: (pathname: string) => boolean;
}
