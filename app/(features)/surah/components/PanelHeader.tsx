'use client';

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

export function PanelHeader({ title, onClose }: PanelHeaderProps): React.JSX.Element {
  return (
    <header className="flex items-center p-4 border-b border-border">
      <button
        onClick={onClose}
        className="p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-interactive-hover"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 className="text-lg font-bold text-center flex-grow text-foreground">{title}</h2>
    </header>
  );
}

export default PanelHeader;
