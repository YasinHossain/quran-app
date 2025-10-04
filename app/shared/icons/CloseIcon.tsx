import { X } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const CloseIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <X size={size} className={className} {...rest} />
);
