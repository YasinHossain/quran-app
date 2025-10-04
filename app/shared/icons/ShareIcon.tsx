import { Share2 } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const ShareIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <Share2 size={size} className={className} {...rest} />
);
