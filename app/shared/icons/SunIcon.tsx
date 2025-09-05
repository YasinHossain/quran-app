import { Sun } from 'lucide-react';

import { IconProps } from './IconProps';

export const SunIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Sun size={size} className={className} {...rest} />
);
