interface ErrorActionsProps {
  onTryAgain: () => void;
  onGoHome: () => void;
}

export const ErrorActions = ({ onTryAgain, onGoHome }: ErrorActionsProps): React.JSX.Element => (
  <div className="flex space-x-3">
    <button
      onClick={onTryAgain}
      className="flex-1 bg-accent hover:bg-accent-hover text-on-accent font-medium py-2 px-4 rounded-md transition-colors"
    >
      Try Again
    </button>
    <button
      onClick={onGoHome}
      className="flex-1 bg-interactive hover:bg-interactive-hover text-foreground font-medium py-2 px-4 rounded-md transition-colors"
    >
      Go Home
    </button>
  </div>
);
