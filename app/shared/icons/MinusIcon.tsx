import { Minus } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const MinusIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Minus size={size} className={className} {...rest} />
);
