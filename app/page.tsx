"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await res.json();
        setSurahs(data.data);
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Quran App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah) => (
          <Link key={surah.number} href={`/surah/${surah.number}`} className="block p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            
              <div className="flex justify-between">
                <div className="font-bold">
                  {surah.number}. {surah.englishName}
                </div>
                <div className="text-right">{surah.name}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {surah.englishNameTranslation}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {surah.revelationType} - {surah.numberOfAyahs} Ayahs
              </div>
            
          </Link>
        ))}
      </div>
    </div>
  );
}