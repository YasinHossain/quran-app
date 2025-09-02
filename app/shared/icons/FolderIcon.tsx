import { Folder } from 'lucide-react';
import { IconProps } from './IconProps';

export const FolderIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Folder size={size} className={className} {...rest} />
);
