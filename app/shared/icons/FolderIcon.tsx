import { Folder } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const FolderIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Folder size={size} className={className} {...rest} />
);
