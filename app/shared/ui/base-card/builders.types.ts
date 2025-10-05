import type {
  AnchorElementProps,
  DivElementProps,
  LinkCommonProps,
  DivCommonProps,
  BaseCommonProps,
  BaseCardCommonProps,
} from './common-types';
import type { BaseCardProps } from '@/app/shared/ui/base-card.types';
import type React from 'react';

type BaseSectionInput = {
  children?: React.ReactNode;
  className?: string;
  isActive?: boolean;
  dataActive?: boolean;
  variant?: BaseCardProps['variant'];
  animation?: BaseCardProps['animation'];
  customVariant?: BaseCardProps['customVariant'];
  customAnimation?: BaseCardProps['customAnimation'];
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
};

type LayoutSectionInput = {
  layout?: BaseCardProps['layout'];
  direction?: BaseCardProps['direction'];
  align?: BaseCardProps['align'];
  justify?: BaseCardProps['justify'];
  gap?: string;
};

type LinkOptions = Pick<BaseCardProps, 'prefetch' | 'replace' | 'shallow' | 'locale' | 'scroll'>;

interface NormalizedBase {
  base: {
    children?: React.ReactNode;
    className?: string;
    isActive: boolean;
    dataActive?: boolean;
    variant: NonNullable<BaseCardProps['variant']>;
    animation: NonNullable<BaseCardProps['animation']>;
    customVariant?: BaseCardProps['customVariant'];
    customAnimation?: BaseCardProps['customAnimation'];
    role?: string;
    tabIndex?: number;
    ariaLabel?: string;
    onKeyDown?: (event: React.KeyboardEvent) => void;
  };
  layout: {
    layout: BaseCardProps['layout'];
    direction: BaseCardProps['direction'];
    align: BaseCardProps['align'];
    justify: BaseCardProps['justify'];
    gap: string;
  };
}

interface NormalizedLinkProps extends NormalizedBase {
  kind: 'link';
  link: {
    href: NonNullable<BaseCardProps['href']>;
    scroll?: BaseCardProps['scroll'];
    prefetch?: BaseCardProps['prefetch'];
    replace?: BaseCardProps['replace'];
    shallow?: BaseCardProps['shallow'];
    locale?: BaseCardProps['locale'];
  };
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  elementProps: AnchorElementProps;
}

interface NormalizedDivProps extends NormalizedBase {
  kind: 'div';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  elementProps: DivElementProps;
}

type NormalizedProps = NormalizedLinkProps | NormalizedDivProps;

type BuildersExports = {
  BaseSectionInput: BaseSectionInput;
  LayoutSectionInput: LayoutSectionInput;
  LinkOptions: LinkOptions;
  NormalizedBase: NormalizedBase;
  NormalizedLinkProps: NormalizedLinkProps;
  NormalizedDivProps: NormalizedDivProps;
  NormalizedProps: NormalizedProps;
  BaseCommonProps: BaseCommonProps;
  BaseCardCommonProps: BaseCardCommonProps;
  LinkCommonProps: LinkCommonProps;
  DivCommonProps: DivCommonProps;
  AnchorElementProps: AnchorElementProps;
  DivElementProps: DivElementProps;
};

export type {
  AnchorElementProps,
  BaseCardCommonProps,
  BaseCommonProps,
  BaseSectionInput,
  BuildersExports,
  DivCommonProps,
  DivElementProps,
  LayoutSectionInput,
  LinkCommonProps,
  LinkOptions,
  NormalizedBase,
  NormalizedDivProps,
  NormalizedLinkProps,
  NormalizedProps,
};
