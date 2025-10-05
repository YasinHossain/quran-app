import { motion } from 'framer-motion';
import Link from 'next/link';

import { buildAccessibilityProps, buildLinkBehaviorProps, isLinkProps } from './renderers.shared';

import type {
  BaseCardCommonProps,
  DivCommonProps,
  LinkCommonProps,
} from '@/app/shared/ui/base-card/common-types';
import type { AnimationConfig } from '@/app/shared/ui/base-card.config';
import type React from 'react';

type FramerRenderProps = BaseCardCommonProps & {
  animationConfig: AnimationConfig;
};

type FramerAnimation = NonNullable<AnimationConfig['framer']>;

type UnknownProps = Record<string, unknown>;
type UnknownComponent = React.ComponentType<UnknownProps>;

interface MotionFactory {
  (component: UnknownComponent): UnknownComponent;
  create?: (component: UnknownComponent) => UnknownComponent;
  div?: UnknownComponent;
}

const motionFactory = motion as unknown as MotionFactory | undefined;

const ensureMotionComponent = (Component: UnknownComponent): UnknownComponent => {
  if (motionFactory && typeof (motionFactory as { create?: unknown }).create === 'function') {
    return (motionFactory as { create: (component: UnknownComponent) => UnknownComponent }).create(
      Component
    );
  }

  if (typeof motionFactory === 'function') {
    return motionFactory(Component);
  }

  return Component;
};

const fallbackMotionDiv: UnknownComponent = (props) => (
  <div {...(props as React.HTMLAttributes<HTMLDivElement>)} />
);

const MotionLink: UnknownComponent = ensureMotionComponent(Link as unknown as UnknownComponent);
const MotionDiv: UnknownComponent = motionFactory?.div ?? ensureMotionComponent(fallbackMotionDiv);

const renderMotionLink = (props: LinkCommonProps, framer: FramerAnimation): React.JSX.Element => {
  const a11yProps = buildAccessibilityProps(props);
  const behaviorProps = buildLinkBehaviorProps(props);

  const linkProps: UnknownProps = {
    href: props.href,
    className: props.baseClasses,
    'data-active': props.dataActive ? 'true' : undefined,
    ...a11yProps,
    ...behaviorProps,
    ...props.elementProps,
    initial: framer.initial,
    animate: framer.animate,
    transition: framer.transition,
  };

  if (props.onClick) linkProps['onClick'] = props.onClick;
  if (framer.exit) linkProps['exit'] = framer.exit;
  if (framer.hover) linkProps['whileHover'] = framer.hover;

  return <MotionLink {...linkProps}>{props.children}</MotionLink>;
};

const renderMotionDiv = (props: DivCommonProps, framer: FramerAnimation): React.JSX.Element => {
  const a11yProps = buildAccessibilityProps(props);

  const divProps: UnknownProps = {
    className: props.baseClasses,
    'data-active': props.dataActive ? 'true' : undefined,
    ...a11yProps,
    ...props.elementProps,
    initial: framer.initial,
    animate: framer.animate,
    transition: framer.transition,
  };

  if (props.onClick) divProps['onClick'] = props.onClick;
  if (framer.exit) divProps['exit'] = framer.exit;
  if (framer.hover) divProps['whileHover'] = framer.hover;

  return <MotionDiv {...divProps}>{props.children}</MotionDiv>;
};

const renderFramerMotion = ({
  animationConfig,
  ...props
}: FramerRenderProps): React.JSX.Element => {
  const framer = animationConfig.framer!;
  return isLinkProps(props) ? renderMotionLink(props, framer) : renderMotionDiv(props, framer);
};

export { renderFramerMotion };
