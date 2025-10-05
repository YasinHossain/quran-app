import { ArrowLeft } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const ArrowLeftIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <ArrowLeft size={size} className={className} {...rest} />
);
