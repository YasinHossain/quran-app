import { Globe } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const GlobeIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Globe size={size} className={className} {...rest} />
);
