import { ChevronRight } from 'lucide-react';
import { IconProps } from './IconProps';

export const ChevronRightIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <ChevronRight size={size} className={className} {...rest} />
);

