import { MapPin } from 'lucide-react';

import { IconProps } from './IconProps';

export const PinIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <MapPin size={size} className={className} {...rest} />
);
