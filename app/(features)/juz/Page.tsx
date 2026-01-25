import Link from 'next/link';

import { getAllJuzs } from '@/app/shared/navigation/datasets';

export default function JuzIndexPage(): React.JSX.Element {
  const juzs = getAllJuzs();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Juz</h1>
      <ul className="space-y-2">
        {juzs.map((j) => (
          <li key={j.number}>
            <Link href={`/juz/${j.number}`}>{j.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
