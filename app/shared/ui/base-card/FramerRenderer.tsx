'use client';

import React from 'react';

import { renderFramerMotion } from './renderers.motion';

import type { AnimationConfig } from '@/app/shared/ui/base-card.config';
import type { BaseCardCommonProps } from '@/app/shared/ui/base-card.utils';

interface FramerRendererProps {
  animationConfig: AnimationConfig;
  commonProps: BaseCardCommonProps;
}

const FramerRenderer = ({ animationConfig, commonProps }: FramerRendererProps): React.JSX.Element =>
  renderFramerMotion({ ...commonProps, animationConfig });

export default FramerRenderer;
