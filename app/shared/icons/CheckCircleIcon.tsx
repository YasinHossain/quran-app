import { CheckCircle2 } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const CheckCircleIcon = ({ size = 20, className = '', ...rest }: IconProps): JSX.Element => (
  <CheckCircle2 size={size} className={className} {...rest} />
);
