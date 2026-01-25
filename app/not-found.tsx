import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background text-foreground p-6">
      <h1 className="text-2xl font-semibold mb-4">Page not found</h1>
      <Link
        href="/"
        className="text-accent hover:text-accent-hover focus:text-accent-hover hover:underline"
      >
        Home
      </Link>
    </div>
  );
}
