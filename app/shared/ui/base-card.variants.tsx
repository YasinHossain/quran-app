import React from 'react';

import { BaseCard } from './BaseCard';

import type { ConvenienceCardProps } from './base-card.types';

export const NavigationCard = (props: ConvenienceCardProps): React.JSX.Element => (
  <BaseCard variant="navigation" animation="navigation" {...props} />
);

export const FolderCardBase = (props: ConvenienceCardProps): React.JSX.Element => (
  <BaseCard variant="folder" animation="folder" {...props} />
);

export const BookmarkCardBase = (props: ConvenienceCardProps): React.JSX.Element => (
  <BaseCard variant="bookmark" animation="bookmark" {...props} />
);
