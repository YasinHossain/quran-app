import { BookOpen } from 'lucide-react';

import { IconProps } from './IconProps';

import type { JSX } from 'react';

export const BookReaderIcon = ({ size = 18, className = '', ...rest }: IconProps): JSX.Element => (
  <BookOpen size={size} className={className} {...rest} />
);
