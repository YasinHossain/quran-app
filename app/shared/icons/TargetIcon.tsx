import { Target } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const TargetIcon = ({ size = 20, className = '', ...rest }: IconProps): JSX.Element => (
  <Target size={size} className={className} {...rest} />
);
