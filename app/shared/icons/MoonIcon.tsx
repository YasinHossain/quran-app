import { Moon } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const MoonIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Moon size={size} className={className} {...rest} />
);
