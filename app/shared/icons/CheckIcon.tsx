import { Check } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const CheckIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Check size={size} className={className} {...rest} />
);
