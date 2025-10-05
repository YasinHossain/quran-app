import { ChevronLeft } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const ChevronLeftIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <ChevronLeft size={size} className={className} {...rest} />
);
