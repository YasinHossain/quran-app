import { Navigation } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const GoToIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Navigation size={size} className={className} {...rest} />
);
