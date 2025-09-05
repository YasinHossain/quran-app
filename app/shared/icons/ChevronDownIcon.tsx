import { ChevronDown } from 'lucide-react';

import { IconProps } from './IconProps';

export const ChevronDownIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <ChevronDown size={size} className={className} {...rest} />
);
