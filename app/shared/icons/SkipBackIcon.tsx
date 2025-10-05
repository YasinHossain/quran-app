import { SkipBack } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const SkipBackIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <SkipBack size={size} className={className} {...rest} />
);
