'use client';

import clsx from 'clsx';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  useLayoutEffect,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
} from 'react';

import { ChevronDownIcon } from '@/app/shared/icons';

export interface SurahOption {
  value: string;
  label: string;
}

interface SurahSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SurahOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
  clearLabel?: string;
  inputId?: string;
}

/**
 * Searchable combobox used for Surah and verse selection.
 * Users can type values directly while still getting a styled dropdown list.
 */
export const SurahSelect = memo(function SurahSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
  clearable = false,
  clearLabel = 'Clear selection',
  inputId: inputIdProp,
}: SurahSelectProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const generatedInputId = useId();
  const inputId = inputIdProp ?? generatedInputId;

  const DROPDOWN_MAX_HEIGHT = 28 * 16;
  const [dropdownMetrics, setDropdownMetrics] = useState<{
    placement: 'top' | 'bottom';
    maxHeight: number;
  }>({
    placement: 'bottom',
    maxHeight: DROPDOWN_MAX_HEIGHT,
  });

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);

  useEffect(() => {
    const selectedIdx = options.findIndex((option) => option.value === value);
    if (selectedIdx >= 0) {
      setActiveIndex(selectedIdx);
    } else if (!options.length) {
      setActiveIndex(-1);
    }
  }, [options, value]);

  useEffect(() => {
    if (!isTyping) {
      setInputValue(selectedOption?.label ?? '');
    }
  }, [isTyping, selectedOption]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent): void => {
      const target = event.target as Node | null;
      if (containerRef.current?.contains(target)) return;
      if (isTyping) setIsTyping(false);
      setInputValue(selectedOption?.label ?? '');
      setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [isTyping, open, selectedOption?.label]);

  const handleContainerBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget as Node | null;
      if (next && containerRef.current?.contains(next)) return;
      if (isTyping) setIsTyping(false);
      setInputValue(selectedOption?.label ?? '');
      setOpen(false);
    },
    [isTyping, selectedOption?.label]
  );

  const updateDropdownMetrics = useCallback(() => {
    if (!open || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const needsFlip = spaceBelow < 280 && spaceAbove > spaceBelow;
    const placement: 'top' | 'bottom' = needsFlip ? 'top' : 'bottom';
    const available = placement === 'bottom' ? spaceBelow : spaceAbove;
    const safeSpace = Math.max(150, available - 20);
    const maxHeight =
      safeSpace > 0 ? Math.min(DROPDOWN_MAX_HEIGHT, safeSpace) : Math.min(DROPDOWN_MAX_HEIGHT, 320);

    setDropdownMetrics((prev) => {
      if (prev.placement === placement && prev.maxHeight === maxHeight) {
        return prev;
      }
      return { placement, maxHeight };
    });
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    updateDropdownMetrics();

    const handleResize = (): void => updateDropdownMetrics();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return (): void => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [open, updateDropdownMetrics]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setInputValue(next);
      setIsTyping(true);
      if (!open) setOpen(true);
      if (!next.trim()) {
        onChange('');
        setActiveIndex(0);
        return;
      }

      const query = next.trim().toLowerCase();
      const matchIndex = options.findIndex(
        (option) =>
          option.value.toLowerCase().startsWith(query) || option.label.toLowerCase().includes(query)
      );
      if (matchIndex >= 0) {
        const matchedOption = options[matchIndex];
        if (matchedOption) {
          onChange(matchedOption.value);
          setActiveIndex(matchIndex);
        }
      }
    },
    [onChange, open, options]
  );

  const handleOptionSelect = useCallback(
    (option: SurahOption) => {
      onChange(option.value);
      setInputValue(option.label);
      setIsTyping(false);
      setOpen(false);
    },
    [onChange]
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!open) setOpen(true);
        if (!options.length) return;
        setActiveIndex((prev) => {
          if (prev < 0) return 0;
          const delta = event.key === 'ArrowDown' ? 1 : -1;
          return Math.min(Math.max(prev + delta, 0), options.length - 1);
        });
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const option = options[activeIndex] ?? options[0];
        if (option) handleOptionSelect(option);
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        setIsTyping(false);
        setInputValue(selectedOption?.label ?? '');
      }
    },
    [activeIndex, disabled, handleOptionSelect, open, options, selectedOption?.label]
  );

  useEffect(() => {
    if (!open || activeIndex < 0) return;
      const optionEl = listRef.current?.querySelector<HTMLButtonElement>(`[data-index="${activeIndex}"]`);
      optionEl?.scrollIntoView({ block: 'center' });
  }, [activeIndex, open]);

  const toggleList = useCallback(() => {
    if (disabled || !options.length) return;
    setOpen((prev) => !prev);
    inputRef.current?.focus();
  }, [disabled, options.length]);

  return (
    <div className={clsx('relative', className)} ref={containerRef} onBlur={handleContainerBlur}>
      <div
        className={clsx(
          'relative rounded-lg border border-border bg-surface transition-colors',
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-accent/10'
        )}
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-disabled={disabled}
          id={inputId}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={(): void => {
            if (!disabled) setOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          className={clsx(
            'w-full bg-transparent text-foreground text-sm px-3 py-2.5 pr-16 rounded-lg outline-none placeholder:text-muted'
          )}
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 text-muted">
          {clearable && !disabled && value ? (
            <button
              type="button"
              aria-label={clearLabel}
              className="pointer-events-auto hover:text-foreground transition-colors"
              onClick={(event): void => {
                event.preventDefault();
                event.stopPropagation();
                setInputValue('');
                setIsTyping(false);
                onChange('');
                inputRef.current?.focus();
              }}
            >
              ×
            </button>
          ) : null}
          <button
            type="button"
            className="pointer-events-auto hover:text-foreground transition-colors"
            aria-label="Toggle options"
            disabled={disabled}
            onClick={(event): void => {
              event.preventDefault();
              event.stopPropagation();
              toggleList();
            }}
          >
            <ChevronDownIcon size={18} />
          </button>
        </div>
      </div>

      {open ? (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          tabIndex={-1}
          className={clsx(
            'absolute z-dropdown w-full overflow-auto rounded-lg border border-border/40 bg-surface/95 backdrop-blur-md shadow-lg focus:outline-none py-2',
            dropdownMetrics.placement === 'bottom' ? 'top-full mt-2 origin-top' : 'bottom-full mb-2 origin-bottom'
          )}
          style={{ maxHeight: dropdownMetrics.maxHeight }}
        >
          <div className="space-y-1 px-1">
            {options.map((option, index) => {
              const selected = option.value === value;
              const isActive = index === activeIndex;
              const optionId = `${listboxId}-option-${index}`;
                return (
                  <button
                    key={option.value}
                    id={optionId}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-index={index}
                    onClick={(): void => handleOptionSelect(option)}
                    className={clsx(
                      'w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors',
                      selected
                        ? 'bg-interactive-hover text-foreground'
                        : isActive
                          ? 'bg-interactive-hover text-foreground'
                          : 'text-foreground hover:bg-interactive/60'
                    )}
                  >
                  <span className="block truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
});
