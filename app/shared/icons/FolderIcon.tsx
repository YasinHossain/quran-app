import { Folder } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const FolderIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Folder size={size} className={className} {...rest} />
);
