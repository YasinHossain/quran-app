import type { BaseCardCommonProps, LinkCommonProps } from '@/app/shared/ui/base-card/common-types';
import type React from 'react';

type AccessibilityProps = {
  role?: React.AriaRole;
  tabIndex?: number;
  'aria-label'?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

const isLinkProps = (props: BaseCardCommonProps): props is LinkCommonProps =>
  'href' in props && props.href !== undefined;

const buildAccessibilityProps = (
  props: Pick<BaseCardCommonProps, 'role' | 'tabIndex' | 'ariaLabel' | 'onKeyDown'>
): AccessibilityProps => {
  const a11yProps: AccessibilityProps = {};

  if (props.role) a11yProps.role = props.role;
  if (props.tabIndex !== undefined) a11yProps.tabIndex = props.tabIndex;
  if (props.ariaLabel) a11yProps['aria-label'] = props.ariaLabel;
  if (props.onKeyDown)
    a11yProps.onKeyDown = props.onKeyDown as React.KeyboardEventHandler<HTMLElement>;

  return a11yProps;
};

const buildLinkBehaviorProps = (
  props: LinkCommonProps
): Partial<Pick<LinkCommonProps, 'prefetch' | 'replace' | 'scroll' | 'shallow' | 'locale'>> => {
  const behaviorProps: Partial<
    Pick<LinkCommonProps, 'prefetch' | 'replace' | 'scroll' | 'shallow' | 'locale'>
  > = {};

  if (props.scroll !== undefined) behaviorProps.scroll = props.scroll;
  if (props.prefetch !== undefined) behaviorProps.prefetch = props.prefetch;
  if (props.replace !== undefined) behaviorProps.replace = props.replace;
  if (props.shallow !== undefined) behaviorProps.shallow = props.shallow;
  if (props.locale !== undefined) behaviorProps.locale = props.locale;

  return behaviorProps;
};

const omitUndefined = <T extends Record<PropertyKey, unknown>>(
  obj: T
): { [K in keyof T]?: Exclude<T[K], undefined> } => {
  const result: Partial<Record<PropertyKey, unknown>> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result as { [K in keyof T]?: Exclude<T[K], undefined> };
};

export { buildAccessibilityProps, buildLinkBehaviorProps, isLinkProps, omitUndefined };
export type { AccessibilityProps };
