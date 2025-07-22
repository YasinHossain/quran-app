export default function HomePageBackground() {
  return (
    <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white bg-gradient-to-br from-cyan-50/20 via-white to-emerald-50/20 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10rem] right-[-10rem] h-72 w-72 rounded-full bg-emerald-400/10 filter blur-3xl opacity-50 dark:bg-emerald-500/10"></div>
      <div className="absolute bottom-[-5rem] left-[-10rem] h-80 w-80 rounded-full bg-cyan-400/10 filter blur-3xl opacity-40 dark:bg-cyan-500/10"></div>
    </div>
  );
}
