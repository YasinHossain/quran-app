import { LayoutGrid } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const GridIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <LayoutGrid size={size} className={className} {...rest} />
);
