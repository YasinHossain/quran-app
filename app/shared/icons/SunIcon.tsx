import { Sun } from 'lucide-react';

import { IconProps } from './IconProps';

export const SunIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Sun size={size} className={className} {...rest} />
);
