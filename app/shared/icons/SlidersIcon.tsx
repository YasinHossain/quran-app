import { SlidersHorizontal } from 'lucide-react';

import { IconProps } from './IconProps';

export const SlidersIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <SlidersHorizontal size={size} className={className} {...rest} />
);
