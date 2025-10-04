import { Check } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const CheckIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Check size={size} className={className} {...rest} />
);
