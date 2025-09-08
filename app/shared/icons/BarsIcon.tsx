import { Menu } from 'lucide-react';

import { IconProps } from './IconProps';

export const BarsIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Menu size={size} className={className} {...rest} />
);
