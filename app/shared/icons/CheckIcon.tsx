import { Check } from 'lucide-react';

import { IconProps } from './IconProps';

export const CheckIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Check size={size} className={className} {...rest} />
);
