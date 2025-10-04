import { BookOpen } from 'lucide-react';
import type { JSX } from 'react';

import { IconProps } from './IconProps';

export const BookReaderIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <BookOpen size={size} className={className} {...rest} />
);
