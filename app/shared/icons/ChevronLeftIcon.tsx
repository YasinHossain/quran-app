import { ChevronLeft } from 'lucide-react';

import { IconProps } from './IconProps';

export const ChevronLeftIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <ChevronLeft size={size} className={className} {...rest} />
);
