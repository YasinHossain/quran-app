import { SkipForward } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const SkipForwardIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <SkipForward size={size} className={className} {...rest} />
);
