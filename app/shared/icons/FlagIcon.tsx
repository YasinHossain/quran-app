import { Flag } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const FlagIcon = ({ size = 20, className = '', ...rest }: IconProps): JSX.Element => (
  <Flag size={size} className={className} {...rest} />
);
