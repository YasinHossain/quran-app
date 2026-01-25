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

type UnknownProps = Record<string, unknown>;

const renderLink = (props: LinkCommonProps): React.JSX.Element => {
  const a11yProps = buildAccessibilityProps(props);
  const behaviorProps = buildLinkBehaviorProps(props);

  const linkProps: UnknownProps = {
    href: props.href,
    className: props.baseClasses,
    'data-active': props.dataActive ? 'true' : undefined,
    ...a11yProps,
    ...behaviorProps,
    ...props.elementProps,
  };

  if (props.onClick) linkProps['onClick'] = props.onClick;

  return (
    <Link {...(linkProps as unknown as React.ComponentProps<typeof Link>)}>{props.children}</Link>
  );
};

const renderDiv = (props: DivCommonProps): React.JSX.Element => {
  const a11yProps = buildAccessibilityProps(props);

  const divProps: UnknownProps = {
    className: props.baseClasses,
    'data-active': props.dataActive ? 'true' : undefined,
    ...a11yProps,
    ...props.elementProps,
  };

  if (props.onClick) divProps['onClick'] = props.onClick;

  return <div {...(divProps as React.HTMLAttributes<HTMLDivElement>)}>{props.children}</div>;
};

const renderFramerMotion = ({
  animationConfig,
  ...props
}: FramerRenderProps): React.JSX.Element => {
  // Framer Motion is intentionally disabled in this project.
  // We keep the renderer so existing config paths continue to work, but we ignore animationConfig.
  void animationConfig;
  return isLinkProps(props) ? renderLink(props) : renderDiv(props);
};

export { renderFramerMotion };
