import { ChevronDown } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const ChevronDownIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <ChevronDown size={size} className={className} {...rest} />
);
