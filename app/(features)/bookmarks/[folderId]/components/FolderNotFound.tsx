import { memo } from 'react';

/**
 * Component displayed when a bookmark folder is not found.
 * Shows a centered error message with proper styling.
 */
export const FolderNotFound = memo(function FolderNotFound() {
  return (
    <div className="h-screen text-foreground font-sans overflow-hidden">
      <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Folder Not Found</h1>
          <p className="text-muted">The requested bookmark folder does not exist.</p>
        </div>
      </div>
    </div>
  );
});

export default FolderNotFound;
