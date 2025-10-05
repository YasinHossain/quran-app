import { Play } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const PlayIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Play size={size} className={className} aria-hidden="true" {...rest} />
);
