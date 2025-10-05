import { SkipForward } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const SkipForwardIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <SkipForward size={size} className={className} {...rest} />
);
