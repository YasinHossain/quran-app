import { Repeat } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const RepeatIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Repeat size={size} className={className} {...rest} />
);
