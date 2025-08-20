import { SearchInput } from '@/app/shared/components/SearchInput';

interface HomeSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function HomeSearch({ searchQuery, setSearchQuery }: HomeSearchProps) {
  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];

  return (
    <>
      <div className="mt-10 w-full max-w-2xl mx-auto content-visibility-auto animate-fade-in-up animation-delay-200">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="What do you want to read?"
          size="lg"
          variant="glass"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3 content-visibility-auto animate-fade-in-up animation-delay-200">
        {shortcutSurahs.map((name) => (
          <button
            key={name}
            className="px-4 sm:px-5 py-2 rounded-full font-medium shadow-sm transition-all duration-200 bg-button-secondary border border-border text-content-primary hover:bg-button-secondary-hover hover:shadow-md hover:scale-105 transform backdrop-blur-md"
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );
}
