import type {
  AnchorElementProps,
  BaseCardCommonProps,
  BaseCommonProps,
  BaseSectionInput,
  DivCommonProps,
  DivElementProps,
  LayoutSectionInput,
  LinkCommonProps,
  LinkOptions,
  NormalizedBase,
  NormalizedDivProps,
  NormalizedLinkProps,
  NormalizedProps,
} from './builders.types';
import type { BaseCardProps } from '@/app/shared/ui/base-card.types';
import type React from 'react';

const assignIfDefined = <T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined
): void => {
  if (value !== undefined) {
    target[key] = value;
  }
};

const buildBaseSection = (input: BaseSectionInput): NormalizedBase['base'] => {
  const base: NormalizedBase['base'] = {
    children: input.children,
    isActive: input.isActive ?? false,
    variant: input.variant ?? 'navigation',
    animation: input.animation ?? 'navigation',
  };

  assignIfDefined(base, 'className', input.className);
  assignIfDefined(base, 'dataActive', input.dataActive);
  assignIfDefined(base, 'customVariant', input.customVariant);
  assignIfDefined(base, 'customAnimation', input.customAnimation);
  assignIfDefined(base, 'role', input.role);
  assignIfDefined(base, 'tabIndex', input.tabIndex);
  assignIfDefined(base, 'ariaLabel', input.ariaLabel);
  assignIfDefined(base, 'onKeyDown', input.onKeyDown);

  return base;
};

const buildLayoutSection = (input: LayoutSectionInput): NormalizedBase['layout'] => ({
  layout: input.layout ?? 'flex',
  direction: input.direction ?? 'row',
  align: input.align ?? 'center',
  justify: input.justify ?? 'start',
  gap: input.gap ?? 'gap-4',
});

interface LinkNormalizedParams {
  base: NormalizedBase['base'];
  layout: NormalizedBase['layout'];
  href: NonNullable<BaseCardProps['href']>;
  options: LinkOptions;
  elementProps: AnchorElementProps;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const buildLinkNormalized = ({
  base,
  layout,
  href,
  options,
  elementProps,
  onClick,
}: LinkNormalizedParams): NormalizedLinkProps => {
  const linkConfig: NormalizedLinkProps['link'] = { href };
  assignIfDefined(linkConfig, 'scroll', options.scroll);
  assignIfDefined(linkConfig, 'prefetch', options.prefetch);
  assignIfDefined(linkConfig, 'replace', options.replace);
  assignIfDefined(linkConfig, 'shallow', options.shallow);
  assignIfDefined(linkConfig, 'locale', options.locale);

  return {
    kind: 'link',
    base,
    layout,
    link: linkConfig,
    elementProps,
    ...(onClick ? { onClick } : {}),
  };
};

interface DivNormalizedParams {
  base: NormalizedBase['base'];
  layout: NormalizedBase['layout'];
  elementProps: DivElementProps;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const buildDivNormalized = ({
  base,
  layout,
  elementProps,
  onClick,
}: DivNormalizedParams): NormalizedDivProps => ({
  kind: 'div',
  base,
  layout,
  elementProps,
  ...(onClick ? { onClick } : {}),
});

const buildCommonProps = (
  base: BaseCommonProps,
  normalized: NormalizedProps
): BaseCardCommonProps => {
  if (normalized.kind === 'link') {
    const linkProps: LinkCommonProps = {
      ...base,
      href: normalized.link.href,
      elementProps: normalized.elementProps,
    };

    assignIfDefined(linkProps, 'scroll', normalized.link.scroll);
    assignIfDefined(linkProps, 'prefetch', normalized.link.prefetch);
    assignIfDefined(linkProps, 'replace', normalized.link.replace);
    assignIfDefined(linkProps, 'shallow', normalized.link.shallow);
    assignIfDefined(linkProps, 'locale', normalized.link.locale);

    if (normalized.onClick) {
      linkProps.onClick = normalized.onClick;
    }

    return linkProps;
  }

  const divProps: DivCommonProps = {
    ...base,
    elementProps: normalized.elementProps,
  };

  if (normalized.onClick) {
    divProps.onClick = normalized.onClick;
  }

  return divProps;
};

export {
  assignIfDefined,
  buildBaseSection,
  buildCommonProps,
  buildDivNormalized,
  buildLayoutSection,
  buildLinkNormalized,
};
export type { NormalizedProps };
