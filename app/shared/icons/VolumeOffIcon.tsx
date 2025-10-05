import { VolumeX } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const VolumeOffIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <VolumeX size={size} className={className} {...rest} />
);
