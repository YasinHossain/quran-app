import { IconProps } from './IconProps';

export const BookmarkOutlineIcon = ({ size = 22, className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 384 512" fill="currentColor">
    <path d="M336 0H48C21.5 0 0 21.5 0 48v464l192-112 192 112V48c0-26.5-21.5-48-48-48zm0 428.4L192 342.8 48 428.4V48h288v380.4z" />
  </svg>
);
