import { Repeat } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const RepeatIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Repeat size={size} className={className} {...rest} />
);
