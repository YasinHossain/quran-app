'use client';

import React, { useEffect, useRef, useState } from 'react';

import { MinusIcon, PlusIcon } from '@/app/shared/icons';

interface CounterInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  step?: number;
}

export const CounterInput = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  className = '',
  step = 1,
}: CounterInputProps): React.JSX.Element => {
  const [localValue, setLocalValue] = useState(value.toString());

  // Sync with prop value updates
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleValidation = (val: string) => {
    const parsed = parseInt(val, 10);
    if (!Number.isNaN(parsed)) {
      if (min !== undefined && parsed < min) return;
      if (max !== undefined && parsed > max) return;
      onChange(parsed);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    handleValidation(newValue);
  };

  const handleBlur = () => {
    const parsed = parseInt(localValue, 10);
    // If invalid or out of bounds (though out of bounds handled in validation, empty string is the main case here)
    if (Number.isNaN(parsed)) {
      setLocalValue(value.toString());
    } else {
      // Also clamp on blur if needed (e.g. user typed a number but logic didn't catch it for some reason, though handleValidation should cover it)
      let clamped = parsed;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      if (clamped !== parsed) {
        onChange(clamped);
        setLocalValue(clamped.toString());
      }
    }
  };

  // --- Long Press Logic ---
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handlePressStart = (action: 'inc' | 'dec') => {
    const update = () => {
      const current = valueRef.current;
      let next: number;

      if (action === 'inc') {
        next = current + step;
        if (max !== undefined && next > max) return;
      } else {
        next = current - step;
        if (min !== undefined && next < min) return;
      }

      onChange(next);
    };

    // Immediate action
    update();

    // Start waiting for long press
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(update, 100); // Speed of change
    }, 500); // Delay before rapid change starts
  };

  // Clean up on unmount
  useEffect(() => {
    return () => stopCounter();
  }, []);

  return (
    <div className={className}>
      {label && <label className="block mb-2 text-sm font-semibold text-foreground">{label}</label>}
      <div className="flex items-center w-full rounded-lg border border-border bg-interactive/60 text-foreground focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors duration-150">
        <button
          type="button"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            handlePressStart('dec');
          }}
          onPointerUp={stopCounter}
          onPointerLeave={stopCounter}
          onPointerCancel={stopCounter}
          onContextMenu={(e) => e.preventDefault()}
          disabled={min !== undefined && value <= min}
          className="p-3 text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors focus:outline-none touch-none"
          aria-label="Decrease"
        >
          <MinusIcon size={16} />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="flex-1 min-w-0 bg-transparent p-3 text-center text-foreground placeholder:text-muted focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            handlePressStart('inc');
          }}
          onPointerUp={stopCounter}
          onPointerLeave={stopCounter}
          onPointerCancel={stopCounter}
          onContextMenu={(e) => e.preventDefault()}
          disabled={max !== undefined && value >= max}
          className="p-3 text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors focus:outline-none touch-none"
          aria-label="Increase"
        >
          <PlusIcon size={16} />
        </button>
      </div>
    </div>
  );
};
