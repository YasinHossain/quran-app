'use client';
import { buildTextClasses } from '../../design-system/card-tokens';
import { BaseCard, BaseCardProps } from '../BaseCard';
import { NumberBadge } from '../NumberBadge';

import type React from 'react';

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

interface StandardNavigationCardProps extends Omit<BaseCardProps, 'children'> {
  content: NavigationCardContent;
  onNavigate?: (id: number) => void;
}

export const StandardNavigationCard = ({
  content,
  onNavigate,
  isActive = false,
  className = 'items-center ml-2',
  ...props
}: StandardNavigationCardProps): JSX.Element => {
  const {
    id,
    title,
    subtitle,
    arabic,
    showBadge = true,
    showArabic = false,
    titleWeight = 'semibold',
  } = content;

  const handleClick: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement> = () => {
    onNavigate?.(id);
  };

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={Boolean(isActive)}
      className={className as string}
      onClick={handleClick}
      {...props}
    >
      {/* Number Badge */}
      {showBadge && <NumberBadge number={id} isActive={Boolean(isActive)} />}

      {/* Content Area */}
      <div className={showArabic ? 'flex-grow min-w-0' : undefined}>
        {/* Primary Title */}
        <p
          className={`
          ${titleWeight === 'bold' ? 'font-bold' : 'font-semibold'}
          ${buildTextClasses('primary', Boolean(isActive))}
        `}
        >
          {title}
        </p>

        {/* Subtitle (if provided) */}
        {subtitle && <p className={buildTextClasses('secondary', Boolean(isActive))}>{subtitle}</p>}
      </div>

      {/* Arabic Text (if enabled) */}
      {showArabic && arabic && (
        <p className={buildTextClasses('arabic', Boolean(isActive))}>{arabic}</p>
      )}
    </BaseCard>
  );
};

/**
 * Convenience components for specific navigation types
 */

// For Surah cards (complex layout with Arabic)
export const SurahNavigationCard = (props: StandardNavigationCardProps): JSX.Element => (
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
export const JuzNavigationCard = (props: StandardNavigationCardProps): JSX.Element => (
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
export const PageNavigationCard = (props: StandardNavigationCardProps): JSX.Element => (
  <StandardNavigationCard
    {...props}
    content={{
      ...props.content,
      showArabic: false,
      titleWeight: 'semibold',
      subtitle: undefined, // Pages don't have subtitles
    }}
  />
);
