import { Home } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const HomeIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Home size={size} className={className} {...rest} />
);
