import { ArrowLeft } from 'lucide-react';

import { IconProps } from './IconProps';

export const ArrowLeftIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <ArrowLeft size={size} className={className} {...rest} />
);
