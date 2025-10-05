import { MapPin } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const PinIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <MapPin size={size} className={className} {...rest} />
);
