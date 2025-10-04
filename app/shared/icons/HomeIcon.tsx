import { Home } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const HomeIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Home size={size} className={className} {...rest} />
);
