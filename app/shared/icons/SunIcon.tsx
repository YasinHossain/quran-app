import { Sun } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const SunIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Sun size={size} className={className} {...rest} />
);
