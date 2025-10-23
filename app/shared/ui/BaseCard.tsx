'use client';

import React, { Suspense, lazy, memo } from 'react';

import { renderCSS } from './base-card/renderers.css-renderer';
import { useBaseCard } from './base-card.utils';

import type { CardVariant, AnimationConfig } from './base-card.config';
import type { BaseCardProps } from './base-card.types';

const LazyFramerRenderer = lazy(() => import('./base-card/FramerRenderer'));

export const BaseCard = memo((props: BaseCardProps): React.JSX.Element => {
  const { animationConfig, commonProps } = useBaseCard(props);
  if (animationConfig.type === 'framer' && animationConfig.framer) {
    const cssFallback = renderCSS(commonProps);
    return (
      <Suspense fallback={cssFallback}>
        <LazyFramerRenderer animationConfig={animationConfig} commonProps={commonProps} />
      </Suspense>
    );
  }
  return renderCSS(commonProps);
});

export type { BaseCardProps, CardVariant, AnimationConfig };
