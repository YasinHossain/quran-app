import { Spinner } from '@/app/shared/Spinner';

export function LoadingState(): React.JSX.Element {
  return (
    <div className="flex justify-center py-12 md:py-20">
      <Spinner className="h-6 w-6 md:h-8 md:w-8 text-accent" />
    </div>
  );
}
