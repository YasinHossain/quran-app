import { Hash } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const HashIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Hash size={size} className={className} {...rest} />
);
