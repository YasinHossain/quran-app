import { AlertCircle } from 'lucide-react';
import { IconProps } from './IconProps';

export const AlertIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <AlertCircle size={size} className={className} {...rest} />
);

