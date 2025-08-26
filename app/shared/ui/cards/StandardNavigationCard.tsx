'use client';

import React from 'react';
import { BaseCard, BaseCardProps } from '../BaseCard';
import { NumberBadge } from '../NumberBadge';
import { buildTextClasses } from '../../design-system/card-tokens';

/**
 * StandardNavigationCard
 *
 * A specialized navigation card that maintains the exact visual appearance
 * of current Surah/Juz/Page cards while providing layout flexibility.
 */

interface NavigationCardContent {
  // Core navigation data
  id: number | string;
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
  onNavigate?: (id: string | number) => void;
}

export const StandardNavigationCard: React.FC<StandardNavigationCardProps> = ({
  content,
  onNavigate,
  isActive = false,
  className = 'items-center ml-2',
  ...props
}) => {
  const {
    id,
    title,
    subtitle,
    arabic,
    showBadge = true,
    showArabic = false,
    titleWeight = 'semibold',
  } = content;

  const handleClick = () => {
    onNavigate?.(id);
  };

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={isActive}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {/* Number Badge */}
      {showBadge && (
        <NumberBadge number={typeof id === 'string' ? parseInt(id) : id} isActive={isActive} />
      )}

      {/* Content Area */}
      <div className={showArabic ? 'flex-grow min-w-0' : undefined}>
        {/* Primary Title */}
        <p
          className={`
          ${titleWeight === 'bold' ? 'font-bold' : 'font-semibold'}
          ${buildTextClasses('primary', isActive)}
        `}
        >
          {title}
        </p>

        {/* Subtitle (if provided) */}
        {subtitle && <p className={buildTextClasses('secondary', isActive)}>{subtitle}</p>}
      </div>

      {/* Arabic Text (if enabled) */}
      {showArabic && arabic && <p className={buildTextClasses('arabic', isActive)}>{arabic}</p>}
    </BaseCard>
  );
};

/**
 * Convenience components for specific navigation types
 */

// For Surah cards (complex layout with Arabic)
export const SurahNavigationCard: React.FC<StandardNavigationCardProps> = (props) => (
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
export const JuzNavigationCard: React.FC<StandardNavigationCardProps> = (props) => (
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
export const PageNavigationCard: React.FC<StandardNavigationCardProps> = (props) => (
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
