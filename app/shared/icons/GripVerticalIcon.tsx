import { GripVertical } from 'lucide-react';
import { IconProps } from './IconProps';

export const GripVerticalIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <GripVertical size={size} className={className} {...rest} />
);
