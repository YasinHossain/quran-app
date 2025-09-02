import { Bookmark } from 'lucide-react';
import { IconProps } from './IconProps';

export const BookmarkIcon = ({ size = 18, className = '', ...rest }: IconProps) => (
  <Bookmark size={size} className={className} fill="currentColor" {...rest} />
);
