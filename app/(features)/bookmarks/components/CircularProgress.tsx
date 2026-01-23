import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '@/lib/text/localizeNumbers';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

// Helper function to calculate circle properties
function useCircleProperties(
  size: number,
  strokeWidth: number
): { radius: number; circumference: number } {
  return {
    radius: (size - strokeWidth) / 2,
    circumference: ((size - strokeWidth) / 2) * 2 * Math.PI,
  };
}

// Helper function to manage animated percentage
function useAnimatedPercentage(percentage: number): number {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return animatedPercentage;
}

// Background circle component
const BackgroundCircle = ({
  size,
  radius,
  strokeWidth,
}: {
  size: number;
  radius: number;
  strokeWidth: number;
}): React.JSX.Element => (
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    stroke="rgb(var(--color-border))"
    strokeWidth={strokeWidth}
    fill="transparent"
    className="opacity-60"
  />
);

// Progress circle component
const ProgressCircle = ({
  size,
  radius,
  strokeWidth,
  strokeDasharray,
  strokeDashoffset,
}: {
  size: number;
  radius: number;
  strokeWidth: number;
  strokeDasharray: string;
  strokeDashoffset: number;
}): React.JSX.Element => (
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    stroke="rgb(var(--color-accent))"
    strokeWidth={strokeWidth}
    fill="transparent"
    strokeDasharray={strokeDasharray}
    strokeDashoffset={strokeDashoffset}
    strokeLinecap="round"
    className="transition-all duration-[1500ms]"
    style={{
      filter: 'drop-shadow(0 0 5px rgb(var(--color-accent) / 0.4))',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  />
);

// Center text component
const CenterText = ({
  percentageLabel,
  label,
  valueClassName,
  labelClassName,
}: {
  percentageLabel: string;
  label: string;
  valueClassName?: string;
  labelClassName?: string;
}): React.JSX.Element => (
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <div className={`font-bold text-foreground ${valueClassName ?? 'text-2xl'}`}>
      {percentageLabel}
    </div>
    <div className={`text-muted font-medium ${labelClassName ?? 'text-xs'}`}>{label}</div>
  </div>
);

const CircularProgress = ({
  percentage = 75,
  size = 150,
  strokeWidth = 15,
  label = 'Complete',
  className,
  valueClassName,
  labelClassName,
}: CircularProgressProps): React.JSX.Element => {
  const { i18n } = useTranslation();
  const animatedPercentage = useAnimatedPercentage(percentage);
  const { radius, circumference } = useCircleProperties(size, strokeWidth);
  const percentageLabel = `${formatNumber(Math.round(animatedPercentage), i18n.language, {
    useGrouping: false,
  })}%`;

  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ''}`}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <BackgroundCircle size={size} radius={radius} strokeWidth={strokeWidth} />
        <ProgressCircle
          size={size}
          radius={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <CenterText
        percentageLabel={percentageLabel}
        label={label}
        {...(valueClassName ? { valueClassName } : {})}
        {...(labelClassName ? { labelClassName } : {})}
      />
    </div>
  );
};

export { CircularProgress };
