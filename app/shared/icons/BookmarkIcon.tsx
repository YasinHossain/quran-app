import { Bookmark } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const BookmarkIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Bookmark size={size} className={className} fill="currentColor" {...rest} />
);
