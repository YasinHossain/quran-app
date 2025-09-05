import { BookOpen } from 'lucide-react';

import { IconProps } from './IconProps';

export const BookReaderIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <BookOpen size={size} className={className} {...rest} />
);
