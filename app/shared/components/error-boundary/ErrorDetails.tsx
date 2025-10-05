interface ErrorDetailsProps {
  error?: Error;
}

export const ErrorDetails = ({ error }: ErrorDetailsProps): React.JSX.Element | null => {
  if (process.env.NODE_ENV !== 'development' || !error) {
    return null;
  }

  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-medium text-foreground mb-2">
        Error Details (Development Only)
      </summary>
      <pre className="text-xs bg-interactive p-2 rounded overflow-auto max-h-32">
        {error.toString()}
      </pre>
    </details>
  );
};
