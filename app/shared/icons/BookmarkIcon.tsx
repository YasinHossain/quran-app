import { IconProps } from './IconProps';

export const BookmarkIcon = ({ size = 18, className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 384 512" fill="currentColor">
    <path d="M0 512V48C0 21.5 21.5 0 48 0h288c26.5 0 48 21.5 48 48v464L192 400 0 512z" />
  </svg>
);
