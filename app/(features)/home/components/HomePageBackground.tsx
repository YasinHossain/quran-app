'use client';

/**
 * Renders the fixed gradient background and decorative blobs for the home page.
 */
export function HomePageBackground(): React.JSX.Element {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-bg">
      {/* Decorative Blobs - Optimized with radial-gradients instead of heavy blur filters */}

      {/* Top Right Blob */}
      <div
        className="absolute top-[-10rem] right-[-10rem] h-[35rem] w-[35rem] opacity-50"
        style={{
          background: 'radial-gradient(circle, rgb(var(--color-accent) / 0.3) 0%, transparent 70%)'
        }}
      />

      {/* Bottom Left Blob */}
      <div
        className="absolute bottom-[-5rem] left-[-10rem] h-[40rem] w-[40rem] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgb(var(--color-accent) / 0.3) 0%, transparent 70%)'
        }}
      />

      {/* Center Right Blob */}
      <div
        className="absolute bottom-[20rem] right-[-15rem] h-[45rem] w-[45rem] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgb(var(--color-accent) / 0.2) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
