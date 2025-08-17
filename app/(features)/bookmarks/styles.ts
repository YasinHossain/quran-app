import css from 'styled-jsx/css';

export default css.global`
  @layer components {
    .bm-heading {
      @apply text-gray-900 dark:text-white font-bold tracking-tight;
    }
    .bm-section {
      @apply py-8 space-y-6;
    }
    .bm-section-header {
      @apply mb-8 space-y-2;
    }
    .bm-card {
      @apply rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-[1.02];
    }
    .bm-folder-card {
      @apply border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-800/30 dark:to-teal-700/30 hover:border-teal-300 dark:hover:border-teal-500;
    }
    .bm-general-card {
      @apply border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-800/20 dark:to-emerald-700/20 hover:border-emerald-300 dark:hover:border-emerald-500;
    }
    .bm-badge {
      @apply inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full border;
    }
    .bm-badge-folder {
      @apply bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800;
    }
    .bm-badge-pinned {
      @apply bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800;
    }
    .bm-badge-lastread {
      @apply bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800;
    }
    .bm-badge-general {
      @apply bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800;
    }
    .bm-button-primary {
      @apply bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40;
    }
    .bm-button-ghost {
      @apply text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors;
    }
  }
`;
