import Link from 'next/link';

import {
  buildAccessibilityProps,
  buildLinkBehaviorProps,
  isLinkProps,
  omitUndefined,
} from './renderers.shared';

import type {
  BaseCardCommonProps,
  DivCommonProps,
  LinkCommonProps,
} from '@/app/shared/ui/base-card/common-types';
import type React from 'react';

const renderCssLink = (props: LinkCommonProps): React.JSX.Element => {
  const a11yProps = buildAccessibilityProps(props);
  const behaviorProps = buildLinkBehaviorProps(props);
  const elementProps = omitUndefined(props.elementProps);
  const clickProps = props.onClick ? { onClick: props.onClick } : {};

  return (
    <Link
      href={props.href}
      className={props.baseClasses}
      data-active={props.dataActive ? 'true' : undefined}
      {...clickProps}
      {...a11yProps}
      {...behaviorProps}
      {...elementProps}
    >
      {props.children}
    </Link>
  );
};

const renderCssDiv = (props: DivCommonProps): React.JSX.Element => {
  const a11yProps = buildAccessibilityProps(props);
  const elementProps = omitUndefined(props.elementProps);

  type DivComponentProps = React.HTMLAttributes<HTMLDivElement> & {
    'data-active'?: string;
  };

  const divProps: DivComponentProps = {
    className: props.baseClasses,
    ...a11yProps,
    ...elementProps,
  };

  if (props.dataActive) {
    divProps['data-active'] = 'true';
  }

  if (props.onClick) {
    divProps.onClick = props.onClick;
  }

  return <div {...divProps}>{props.children}</div>;
};

const renderCSS = (props: BaseCardCommonProps): React.JSX.Element =>
  isLinkProps(props) ? renderCssLink(props) : renderCssDiv(props as DivCommonProps);

export { renderCSS };
