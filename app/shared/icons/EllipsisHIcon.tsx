import { MoreHorizontal } from 'lucide-react';
import { IconProps } from './IconProps';

export const EllipsisHIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <MoreHorizontal size={size} className={className} {...rest} />
);
