import { Search } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const SearchIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Search size={size} className={className} {...rest} />
);
