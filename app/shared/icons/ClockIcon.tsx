import { Clock } from 'lucide-react';

import { IconProps } from './IconProps';

export const ClockIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Clock size={size} className={className} {...rest} />
);
