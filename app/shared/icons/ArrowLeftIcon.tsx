import { ArrowLeft } from 'lucide-react';

import { IconProps } from './IconProps';

export const ArrowLeftIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <ArrowLeft size={size} className={className} {...rest} />
);
