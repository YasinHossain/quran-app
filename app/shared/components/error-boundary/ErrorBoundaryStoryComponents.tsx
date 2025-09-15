
// Component that throws an error for testing
export const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('This is a test error for the error boundary');
  }
  return (
    <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Component Working Fine</h3>
      <p className="text-green-700 dark:text-green-300">
        This component is rendering successfully without any errors.
      </p>
    </div>
  );
};

// Custom fallback UI used in stories
export const customFallback = (error: Error | null, resetError: () => void) => (
  <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3">
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Custom Error Handler</h3>
    </div>
    <p className="text-red-700 dark:text-red-300 mb-4">This is a custom error fallback UI. Error: {error?.message}</p>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Nested error boundary example content
export const NestedBoundariesContent = () => (
  <div className="space-y-6">
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Section 1</h4>
      <ErrorThrowingComponent shouldThrow={false} />
    </div>
    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Section 2 (Error)</h4>
      <ErrorThrowingComponent shouldThrow={true} />
    </div>
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Section 3</h4>
      <ErrorThrowingComponent shouldThrow={false} />
    </div>
  </div>
);
