// components/TailwindDebug.tsx
// Add this component to your home page to test if Tailwind is working

export default function TailwindDebug() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Tailwind Debug Test
      </h2>
      
      {/* Basic color test */}
      <div className="flex space-x-4">
        <div className="w-16 h-16 bg-red-500 rounded"></div>
        <div className="w-16 h-16 bg-blue-500 rounded"></div>
        <div className="w-16 h-16 bg-green-500 rounded"></div>
      </div>
      
      {/* Typography test */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Small text</p>
        <p className="text-base text-gray-700">Base text</p>
        <p className="text-lg text-gray-800">Large text</p>
        <p className="text-xl font-bold text-gray-900">Extra large bold</p>
      </div>
      
      {/* Dark mode test */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-900 dark:text-white">
          This should change color in dark mode
        </p>
      </div>
      
      {/* Custom colors test (your design tokens) */}
      <div className="space-y-2">
        <div className="w-32 h-8 bg-accent rounded">Custom Accent</div>
        <div className="w-32 h-8 bg-accent-hover rounded">Custom Accent Hover</div>
      </div>
      
      {/* Responsive test */}
      <div className="w-full h-16 bg-purple-200 md:bg-purple-400 lg:bg-purple-600 rounded">
        <p className="p-4 text-sm">
          Purple-200 on mobile, purple-400 on tablet, purple-600 on desktop
        </p>
      </div>
    </div>
  );
}