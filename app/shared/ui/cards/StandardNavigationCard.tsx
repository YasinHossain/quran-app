'use client';
import React, { memo } from 'react';

import { buildTextClasses } from '@/app/shared/design-system/card-tokens';
import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';
import { NumberBadge } from '@/app/shared/ui/NumberBadge';

/**
 * StandardNavigationCard
 *
 * A specialized navigation card that maintains the exact visual appearance
 * of current Surah/Juz/Page cards while providing layout flexibility.
 */

interface NavigationCardContent {
  // Core navigation data
  id: number;
  title: string;
  subtitle?: string;
  arabic?: string;

  // Display options
  showBadge?: boolean;
  showArabic?: boolean;
  titleWeight?: 'bold' | 'semibold';
}

interface StandardNavigationCardProps extends Omit<BaseCardProps, 'children' | 'content'> {
  content: NavigationCardContent;
  onNavigate?: (id: number) => void;
  scroll?: BaseCardProps['scroll'];
  prefetch?: BaseCardProps['prefetch'];
  replace?: BaseCardProps['replace'];
  shallow?: BaseCardProps['shallow'];
  locale?: BaseCardProps['locale'];
}

interface CardTitleProps {
  title: string;
  titleWeight: 'bold' | 'semibold';
  isActive: boolean;
}

const CardTitle = memo(function CardTitle({
  title,
  titleWeight,
  isActive,
}: CardTitleProps): React.JSX.Element {
  const fontClass = titleWeight === 'bold' ? 'font-bold' : 'font-semibold';

  return <p className={`${fontClass} ${buildTextClasses('primary', isActive)}`}>{title}</p>;
});

interface CardSubtitleProps {
  subtitle: string;
  isActive: boolean;
}

const CardSubtitle = memo(function CardSubtitle({
  subtitle,
  isActive,
}: CardSubtitleProps): React.JSX.Element {
  return <p className={buildTextClasses('secondary', isActive)}>{subtitle}</p>;
});

interface CardArabicTextProps {
  arabic: string;
  isActive: boolean;
}

const CardArabicText = memo(function CardArabicText({
  arabic,
  isActive,
}: CardArabicTextProps): React.JSX.Element {
  return <p className={buildTextClasses('arabic', isActive)}>{arabic}</p>;
});

interface CardContentProps {
  content: NavigationCardContent;
  isActive: boolean;
}

const CardContent = memo(function CardContent({
  content,
  isActive,
}: CardContentProps): React.JSX.Element {
  const { title, subtitle, arabic, showArabic = false, titleWeight = 'semibold' } = content;

  return (
    <>
      <div className={showArabic ? 'flex-grow min-w-0' : undefined}>
        <CardTitle title={title} titleWeight={titleWeight} isActive={isActive} />
        {subtitle && <CardSubtitle subtitle={subtitle} isActive={isActive} />}
      </div>
      {showArabic && arabic && <CardArabicText arabic={arabic} isActive={isActive} />}
    </>
  );
});

export const StandardNavigationCard = memo(function StandardNavigationCard({
  content,
  onNavigate,
  isActive = false,
  className = 'items-center ml-2',
  ...props
}: StandardNavigationCardProps): React.JSX.Element {
  const { id, showBadge = true } = content;
  const activeState = Boolean(isActive);

  const handleClick: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement> = () => {
    onNavigate?.(id);
  };

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={activeState}
      className={className as string}
      onClick={handleClick}
      {...props}
    >
      {showBadge && <NumberBadge number={id} isActive={activeState} />}
      <CardContent content={content} isActive={activeState} />
    </BaseCard>
  );
});

/**
 * Convenience components for specific navigation types
 */

// For Surah cards (complex layout with Arabic)
export const SurahNavigationCard = (props: StandardNavigationCardProps): React.JSX.Element => (
  <StandardNavigationCard
    {...props}
    content={{
      ...props.content,
      showArabic: true,
      titleWeight: 'bold',
    }}
  />
);

// For Juz cards (medium layout, no Arabic)
export const JuzNavigationCard = (props: StandardNavigationCardProps): React.JSX.Element => (
  <StandardNavigationCard
    {...props}
    content={{
      ...props.content,
      showArabic: false,
      titleWeight: 'semibold',
    }}
  />
);

// For Page cards (simple layout)
export const PageNavigationCard = (props: StandardNavigationCardProps): React.JSX.Element => (
  <StandardNavigationCard
    {...props}
    content={{
      ...props.content,
      showArabic: false,
      titleWeight: 'semibold',
    }}
  />
);
