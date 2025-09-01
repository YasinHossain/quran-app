import { X } from 'lucide-react';
import { IconProps } from './IconProps';

export const CloseIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <X size={size} className={className} {...rest} />
);
