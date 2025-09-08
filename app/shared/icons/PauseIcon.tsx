import { Pause } from 'lucide-react';

import { IconProps } from './IconProps';

export const PauseIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Pause size={size} className={className} {...rest} />
);
