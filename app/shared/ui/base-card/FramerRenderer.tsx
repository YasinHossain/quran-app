'use client';

import React from 'react';

import { renderFramerMotion } from './renderers.motion';

import type { BaseCardCommonProps } from '@/app/shared/ui/base-card.utils';
import type { AnimationConfig } from '@/app/shared/ui/base-card.config';

interface FramerRendererProps {
  animationConfig: AnimationConfig;
  commonProps: BaseCardCommonProps;
}

const FramerRenderer = ({
  animationConfig,
  commonProps,
}: FramerRendererProps): React.JSX.Element =>
  renderFramerMotion({ ...commonProps, animationConfig });

export default FramerRenderer;
