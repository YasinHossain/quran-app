import { IconProps } from './IconProps';

export const GridIcon = ({ size = 22, className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M448 32H64C46.33 32 32 46.33 32 64v384c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zM224 160H96V96h128v64zm192 128H288v-64h128v64zm-192 0H96v-64h128v64zm192 0h-64v64h64v-64zm-192 128H96v-64h128v64zm192 0H288v-64h128v64z" />
  </svg>
);
