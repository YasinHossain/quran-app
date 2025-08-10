import React from 'react';

interface SpinnerProps {
  className?: string;
}

/**
 * Renders a spinning SVG to indicate loading state.
 *
 * @param props - Component properties.
 * @param props.className - Optional CSS classes applied to the spinner.
 * @returns The spinner SVG element.
 */
const Spinner = ({ className = '' }: SpinnerProps) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 00-12 12h4z"
    />
  </svg>
);

export default Spinner;
