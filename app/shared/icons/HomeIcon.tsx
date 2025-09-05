import { Home } from 'lucide-react';

import { IconProps } from './IconProps';

export const HomeIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Home size={size} className={className} {...rest} />
);
