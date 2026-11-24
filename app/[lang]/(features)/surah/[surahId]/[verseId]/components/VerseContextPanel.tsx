'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import type { KeyboardEvent, ReactNode } from 'react';

export type ContextView = 'translation' | 'arabic' | 'both';

const CONTEXT_VIEWS: readonly ContextView[] = ['translation', 'arabic', 'both'];
export const CONTEXT_VIEW_STORAGE_KEY = 'verse-page:context-view';

const isContextView = (value: unknown): value is ContextView =>
  CONTEXT_VIEWS.includes(value as ContextView);

function readStoredView(): ContextView | null {
  try {
    const stored = window.localStorage.getItem(CONTEXT_VIEW_STORAGE_KEY);
    return isContextView(stored) ? stored : null;
  } catch {
    return null;
  }
}

function storeView(view: ContextView): void {
  try {
    window.localStorage.setItem(CONTEXT_VIEW_STORAGE_KEY, view);
  } catch {
    // Storage unavailable (private mode, blocked): the choice lasts for this page view only.
  }
}

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scrolls the panel itself (never the window) so the current verse sits in view. */
function centerCurrentVerse(container: HTMLElement, behavior: ScrollBehavior): void {
  const current = container.querySelector<HTMLElement>('[aria-current="true"]');
  if (!current) return;
  const containerRect = container.getBoundingClientRect();
  const currentRect = current.getBoundingClientRect();
  const offset = currentRect.top - containerRect.top + container.scrollTop;
  const centered = offset - Math.max(0, (container.clientHeight - currentRect.height) / 2);
  const top = Math.max(0, Math.min(centered, container.scrollHeight - container.clientHeight));
  if (typeof container.scrollTo === 'function') container.scrollTo({ top, behavior });
  else container.scrollTop = top;
}

type ViewLabels = { group: string } & Record<ContextView, string>;

/** Radio-style arrow keys (mirrored in RTL), Home and End; `null` for any other key. */
function stepView(key: string, current: ContextView, isRtl: boolean): ContextView | null {
  const steps: Record<string, number> = {
    ArrowDown: 1,
    ArrowUp: -1,
    ArrowRight: isRtl ? -1 : 1,
    ArrowLeft: isRtl ? 1 : -1,
  };
  const last = CONTEXT_VIEWS.length - 1;
  if (key === 'Home') return CONTEXT_VIEWS[0] ?? null;
  if (key === 'End') return CONTEXT_VIEWS[last] ?? null;
  const step = steps[key];
  if (step === undefined) return null;
  const index = CONTEXT_VIEWS.indexOf(current) + step;
  return CONTEXT_VIEWS[(index + CONTEXT_VIEWS.length) % CONTEXT_VIEWS.length] ?? null;
}

/** Segmented switch between translation, Arabic and both (one tab stop, arrow keys inside). */
function ContextViewSwitch({
  view,
  labels,
  onSelect,
}: {
  view: ContextView;
  labels: ViewLabels;
  onSelect: (view: ContextView) => void;
}): React.JSX.Element {
  const radioRefs = useRef<Partial<Record<ContextView, HTMLButtonElement | null>>>({});

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const next = stepView(event.key, view, isRtl);
    if (!next) return;
    event.preventDefault();
    onSelect(next);
    radioRefs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={labels.group}
      data-slot="verse-context-view"
      className="inline-flex rounded-lg bg-interactive p-0.5"
    >
      {CONTEXT_VIEWS.map((option) => {
        const checked = option === view;
        return (
          <button
            key={option}
            ref={(node) => {
              radioRefs.current[option] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onSelect(option)}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-h-touch rounded-md px-3 text-sm font-medium transition-colors lg:min-h-9',
              touchClasses.focus,
              checked
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-foreground/80 hover:text-foreground'
            )}
          >
            {labels[option]}
          </button>
        );
      })}
    </div>
  );
}

interface VerseContextPanelProps {
  headingId: string;
  heading: string;
  /** Accessible name of the scrollable verse list. */
  listLabel: string;
  /** Labels for the text switch; omitted when the verses have no translation to switch to. */
  viewLabels?: ViewLabels;
  /** Server-rendered verse list; every verse carries both the translation and the Arabic text. */
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * "Read in context" panel of the verse page. Both text variants are always in the server HTML;
 * `data-context-view` only decides which one is visible. The list scrolls on its own so the
 * current verse can be centred without moving the page.
 */
export function VerseContextPanel({
  headingId,
  heading,
  listLabel,
  viewLabels,
  children,
  footer,
  className,
}: VerseContextPanelProps): React.JSX.Element {
  const [view, setView] = useState<ContextView>('translation');
  const scrollRef = useRef<HTMLDivElement>(null);
  const userChangedView = useRef(false);

  const hasViewSwitch = Boolean(viewLabels);
  useEffect(() => {
    if (!hasViewSwitch) return;
    const stored = readStoredView();
    if (stored) setView(stored);
  }, [hasViewSwitch]);

  // Runs on mount and whenever the visible text (and so every verse's height) changes.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const smooth = userChangedView.current && !prefersReducedMotion();
    centerCurrentVerse(container, smooth ? 'smooth' : 'auto');
  }, [view]);

  const selectView = useCallback((next: ContextView) => {
    userChangedView.current = true;
    setView(next);
    storeView(next);
  }, []);

  return (
    <section
      aria-labelledby={headingId}
      data-slot="verse-context"
      data-context-view={viewLabels ? view : 'arabic'}
      className={cn(
        'group/context flex flex-col gap-3 rounded-lg border border-border bg-surface p-4',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 id={headingId} className="text-lg font-semibold">
          {heading}
        </h2>
        {viewLabels ? (
          <ContextViewSwitch view={view} labels={viewLabels} onSelect={selectView} />
        ) : null}
      </div>
      {/* Mobile: capped height, scroll chains to the page at either end. Desktop: fills the sticky
          panel and keeps the wheel inside it. */}
      <div
        ref={scrollRef}
        role="region"
        aria-label={listLabel}
        // Focusable so keyboard users can scroll it (axe: scrollable-region-focusable).
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        data-slot="verse-context-scroll"
        className={cn(
          '-mx-2 max-h-[60vh] overflow-y-auto rounded-md px-2 lg:min-h-0 lg:max-h-none lg:flex-1 lg:overscroll-y-contain',
          touchClasses.focus
        )}
      >
        {children}
      </div>
      {footer}
    </section>
  );
}
