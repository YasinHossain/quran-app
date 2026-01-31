'use client';

import Link from 'next/link';
import { memo } from 'react';
import { usePathname } from 'next/navigation';

import {
  getLocaleFromPathname,
  localizeHref,
  stripLocaleFromPathname,
} from '@/app/shared/i18n/localeRouting';
import { setTafsirReturnFromTafsirHref } from '@/app/shared/navigation/tafsirReturn';
import { VerseActionItem } from '@/app/shared/verse-actions/types';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface ActionListProps {
  actions: VerseActionItem[];
  onClose: () => void;
}

export const ActionList = memo(function ActionList({
  actions,
  onClose,
}: ActionListProps): React.JSX.Element {
  const rawPathname = usePathname();
  const locale = getLocaleFromPathname(rawPathname) ?? 'en';

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
      <div className="space-y-2">
        {actions.map((action) =>
          action.href ? (
            <Link
              key={action.label}
              href={localizeHref(action.href!, locale)}
              prefetch={true}
              onClick={() => {
                if (stripLocaleFromPathname(action.href!).startsWith('/tafsir/')) {
                  setTafsirReturnFromTafsirHref(localizeHref(action.href!, locale));
                }
                onClose();
              }}
              className={cn(
                'flex items-center gap-4 p-4 rounded-2xl transition-all duration-200',
                'hover:bg-interactive-hover active:bg-interactive',
                touchClasses.target,
                touchClasses.gesture,
                touchClasses.focus,
                touchClasses.active,
                action.active && 'bg-accent/10 text-accent'
              )}
            >
              <div className="flex-shrink-0">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ) : (
            <button
              key={action.label}
              onClick={action.onClick}
              className={cn(
                'flex w-full items-center gap-4 p-4 rounded-2xl transition-all duration-200',
                'hover:bg-interactive-hover active:bg-interactive',
                touchClasses.target,
                touchClasses.gesture,
                touchClasses.focus,
                touchClasses.active,
                action.active && 'bg-accent/10 text-accent'
              )}
            >
              <div className="flex-shrink-0">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
});
