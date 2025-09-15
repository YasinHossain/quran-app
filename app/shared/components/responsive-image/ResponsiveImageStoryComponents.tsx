import { ResponsiveBackgroundImage } from './ResponsiveBackgroundImage';
import { ResponsiveImage } from './ResponsiveImage';

export const FillModeExample = (args: any) => (
  <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
    <ResponsiveImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/800px-Quran_cover.jpg"
      alt="Quran book cover"
      fill
      style={{ objectFit: 'cover' }}
      {...args}
    />
  </div>
);

export const BackgroundImageExample = () => (
  <ResponsiveBackgroundImage
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/800px-Quran_cover.jpg"
    alt="Quran background"
    className="h-96 rounded-lg flex items-center justify-center"
  >
    <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Overlay Content</h2>
      <p className="text-gray-600 dark:text-gray-300">Content displayed over background image</p>
    </div>
  </ResponsiveBackgroundImage>
);

export const GalleryExample = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <div key={index} className="aspect-w-4 aspect-h-3">
        <ResponsiveImage
          src={`https://picsum.photos/400/300?random=${index}`}
          alt={`Gallery image ${index}`}
          width={400}
          height={300}
          className="rounded-lg shadow-md object-cover w-full h-full"
          loading="lazy"
        />
      </div>
    ))}
  </div>
);
