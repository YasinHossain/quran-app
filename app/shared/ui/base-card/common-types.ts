import type { LinkProps } from 'next/link';
import type React from 'react';

type AnchorElementProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href' | 'onClick'
>;

type DivElementProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'onClick'
>;

type BaseCommonProps = {
  baseClasses: string;
  dataActive?: boolean;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  children: React.ReactNode;
};

type LinkCommonProps = BaseCommonProps &
  Partial<Pick<LinkProps, 'prefetch' | 'replace' | 'scroll' | 'shallow' | 'locale'>> & {
    href: LinkProps['href'];
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    elementProps: AnchorElementProps;
  };

type DivCommonProps = BaseCommonProps & {
  href?: undefined;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  elementProps: DivElementProps;
};

type BaseCardCommonProps = LinkCommonProps | DivCommonProps;

type LinkFactoryOptions = {
  href: LinkProps['href'];
  scroll: LinkProps['scroll'];
  prefetch?: LinkProps['prefetch'];
  replace?: LinkProps['replace'];
  shallow?: LinkProps['shallow'];
  locale?: LinkProps['locale'];
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  elementProps: AnchorElementProps;
};

type DivFactoryOptions = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  elementProps: DivElementProps;
};

export type {
  AnchorElementProps,
  BaseCardCommonProps,
  BaseCommonProps,
  DivCommonProps,
  DivElementProps,
  DivFactoryOptions,
  LinkCommonProps,
  LinkFactoryOptions,
};
