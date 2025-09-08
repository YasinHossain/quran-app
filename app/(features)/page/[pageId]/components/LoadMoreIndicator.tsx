import { Spinner } from '@/app/shared/Spinner';

interface LoadMoreIndicatorProps {
  isValidating: boolean;
  isReachingEnd: boolean;
  t: (key: string) => string;
}

export function LoadMoreIndicator({
  isValidating,
  isReachingEnd,
  t,
}: LoadMoreIndicatorProps): React.JSX.Element {
  return (
    <div className="py-4 text-center">
      <div className="flex items-center justify-center space-x-2">
        {isValidating && <Spinner className="inline h-4 w-4 md:h-5 md:w-5 text-accent" />}
        {isReachingEnd && (
          <span className="text-muted text-sm md:text-base">{t('end_of_page')}</span>
        )}
      </div>
    </div>
  );
}
