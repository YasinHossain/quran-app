import { Moon } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const MoonIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Moon size={size} className={className} {...rest} />
);
