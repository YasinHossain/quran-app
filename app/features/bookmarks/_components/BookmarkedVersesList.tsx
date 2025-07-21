// app/features/bookmarks/_components/BookmarkedVersesList.tsx
'use client';
import { useSettings } from '@/app/context/SettingsContext';
// You will likely need to fetch verse data based on the bookmarkedVerseIds
// import { fetchVerseById } from '@/lib/api'; // Assuming you have an API function to fetch verse data
// import { Verse } from '@/types'; // Assuming you have a Verse type

const BookmarkedVersesList = () => {
  const { bookmarkedVerses } = useSettings();
  // const [verses, setVerses] = useState<Verse[]>([]); // State to hold fetched verse data

  // useEffect(() => {
  //   const fetchBookmarkedVerses = async () => {
  //     const fetchedVerses = await Promise.all(
  //       bookmarkedVerses.map(verseId => fetchVerseById(verseId))
  //     );
  //     setVerses(fetchedVerses);
  //   };

  //   fetchBookmarkedVerses();
  // }, [bookmarkedVerses]);

  return (
    <div className="space-y-4">
      {bookmarkedVerses.length === 0 ? (
        <p>No verses bookmarked yet.</p>
      ) : (
        // Render your bookmarked verses here
        // {verses.map(verse => (
        //   <div key={verse.id}>
        //     {/* Render individual verse details */}
        //     <p>{verse.text}</p>
        //   </div>
        // ))}
        <p>Displaying bookmarked verses: {bookmarkedVerses.join(', ')}</p> // Placeholder
      )}
    </div>
  );
};

export default BookmarkedVersesList;
