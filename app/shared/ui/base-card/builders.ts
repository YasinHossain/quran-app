import {
  buildBaseSection,
  buildCommonProps,
  buildDivNormalized,
  buildLayoutSection,
  buildLinkNormalized,
  type NormalizedProps,
} from './builders.shared';

import type { BaseSectionInput, LayoutSectionInput, LinkOptions } from './builders.types';
import type {
  AnchorElementProps,
  BaseCardCommonProps,
  DivCommonProps,
  DivElementProps,
  LinkCommonProps,
} from './common-types';
import type { BaseCardProps } from '@/app/shared/ui/base-card.types';
import type React from 'react';

interface ExtractedSections {
  baseInput: BaseSectionInput;
  layoutInput: LayoutSectionInput;
  linkOptions: LinkOptions;
  href: BaseCardProps['href'];
  onClick: BaseCardProps['onClick'];
  elementProps: Record<string, unknown>;
}

const extractSections = (props: BaseCardProps): ExtractedSections => {
  const {
    children,
    className,
    href,
    onClick,
    isActive,
    'data-active': dataActive,
    variant,
    animation,
    customVariant,
    customAnimation,
    role,
    tabIndex,
    'aria-label': ariaLabel,
    onKeyDown,
    layout,
    direction,
    align,
    justify,
    gap,
    prefetch,
    replace,
    shallow,
    locale,
    scroll,
    ...elementProps
  } = props;

  return {
    baseInput: {
      children,
      className,
      isActive,
      dataActive,
      variant,
      animation,
      customVariant,
      customAnimation,
      role,
      tabIndex,
      ariaLabel,
      onKeyDown,
    } as BaseSectionInput,
    layoutInput: { layout, direction, align, justify, gap } as LayoutSectionInput,
    linkOptions: { prefetch, replace, shallow, locale, scroll } as LinkOptions,
    href,
    onClick,
    elementProps,
  };
};

const normalizeProps = (props: BaseCardProps): NormalizedProps => {
  const { baseInput, layoutInput, linkOptions, href, onClick, elementProps } =
    extractSections(props);

  const base = buildBaseSection(baseInput);
  const layout = buildLayoutSection(layoutInput);

  if (href !== undefined) {
    return buildLinkNormalized({
      base,
      layout,
      href,
      options: linkOptions,
      elementProps: elementProps as AnchorElementProps,
      ...(onClick ? { onClick: onClick as React.MouseEventHandler<HTMLAnchorElement> } : {}),
    });
  }

  return buildDivNormalized({
    base,
    layout,
    elementProps: elementProps as DivElementProps,
    ...(onClick ? { onClick: onClick as React.MouseEventHandler<HTMLDivElement> } : {}),
  });
};

export { buildCommonProps, normalizeProps };
export type { NormalizedProps, BaseCardCommonProps, LinkCommonProps, DivCommonProps };
