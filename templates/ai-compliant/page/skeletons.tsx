export function ContentLoadingSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="h-32 bg-muted rounded-md animate-pulse" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function SidebarSkeleton(): JSX.Element {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
      ))}
    </div>
  );
}

export function MainContentSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded-md animate-pulse w-3/4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function PageErrorFallback(): JSX.Element {
  return (
    <div className="min-h-64 flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground max-w-md">
          We encountered an error while loading this page. Please try
          refreshing or contact support if the problem persists.
        </p>
      </div>
      <button
        className="h-11 px-6 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button>
    </div>
  );
}
