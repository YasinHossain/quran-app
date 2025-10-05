import { Search } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const SearchIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Search size={size} className={className} {...rest} />
);
