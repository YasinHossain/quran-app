import { X } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const CloseIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <X size={size} className={className} {...rest} />
);
