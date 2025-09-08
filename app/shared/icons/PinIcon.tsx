import { Pin } from 'lucide-react';

import { IconProps } from './IconProps';

export const PinIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Pin size={size} className={className} {...rest} />
);
