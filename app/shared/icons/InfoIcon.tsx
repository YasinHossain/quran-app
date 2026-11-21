import { Info } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const InfoIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Info size={size} className={className} {...rest} />
);
