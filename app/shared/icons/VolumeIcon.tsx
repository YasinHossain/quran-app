import { Volume2 } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const VolumeIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Volume2 size={size} className={className} {...rest} />
);
