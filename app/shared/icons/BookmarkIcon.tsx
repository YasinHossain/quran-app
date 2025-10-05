import { Bookmark } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const BookmarkIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Bookmark size={size} className={className} fill="currentColor" {...rest} />
);
