import { Search } from 'lucide-react';

import { IconProps } from './IconProps';

export const SearchIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Search size={size} className={className} {...rest} />
);
