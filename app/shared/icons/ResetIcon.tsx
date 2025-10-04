import { RotateCcw } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const ResetIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <RotateCcw size={size} className={className} {...rest} />
);
