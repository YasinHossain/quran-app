import { LayoutGrid } from 'lucide-react';

import { IconProps } from './IconProps';

export const GridIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <LayoutGrid size={size} className={className} {...rest} />
);
