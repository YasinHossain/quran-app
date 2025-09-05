import { Moon } from 'lucide-react';

import { IconProps } from './IconProps';

export const MoonIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Moon size={size} className={className} {...rest} />
);
