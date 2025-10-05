import { LayoutGrid } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const GridIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <LayoutGrid size={size} className={className} {...rest} />
);
