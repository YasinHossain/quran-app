import { VolumeX } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const VolumeOffIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <VolumeX size={size} className={className} {...rest} />
);
