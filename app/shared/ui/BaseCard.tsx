'use client';

import React, { memo } from 'react';

import { renderFramerMotion, renderCSS } from './base-card/renderers';
import { useBaseCard } from './base-card.utils';

import type { CardVariant, AnimationConfig } from './base-card.config';
import type { BaseCardProps } from './base-card.types';

export const BaseCard = memo((props: BaseCardProps): React.JSX.Element => {
  const { animationConfig, commonProps } = useBaseCard(props);
  return animationConfig.type === 'framer' && animationConfig.framer
    ? renderFramerMotion({ ...commonProps, animationConfig })
    : renderCSS(commonProps);
});

export type { BaseCardProps, CardVariant, AnimationConfig };
