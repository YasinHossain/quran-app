/**
 * Renders the fixed gradient background and decorative blobs for the home page.
 */
export function HomePageBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-bg">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10rem] right-[-10rem] h-72 w-72 rounded-full bg-accent/20 filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-5rem] left-[-10rem] h-80 w-80 rounded-full bg-accent/20 filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-[20rem] right-[-15rem] w-96 h-96 rounded-full bg-accent/20 filter blur-3xl opacity-30"></div>
    </div>
  );
}
