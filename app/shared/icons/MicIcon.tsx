import { Mic2 } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const MicIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Mic2 size={size} className={className} {...rest} />
);
