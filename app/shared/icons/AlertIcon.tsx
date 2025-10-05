import { AlertCircle } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const AlertIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <AlertCircle size={size} className={className} {...rest} />
);
