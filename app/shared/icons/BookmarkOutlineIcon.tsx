import { Bookmark } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const BookmarkOutlineIcon = ({
  size = 18,
  className = '',
  ...rest
}: IconProps): JSX.Element => <Bookmark size={size} className={className} {...rest} />;
