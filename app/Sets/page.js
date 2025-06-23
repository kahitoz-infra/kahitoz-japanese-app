'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SetBlock from './components/SetBlock';

export default function SetsPage() {
  const router = useRouter();
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const statusOptions = ["not attempted", "attempted", "completed"];
    const generatedSets = Array.from({ length: 12 }, (_, i) => {
      const setNo = i + 1;
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const score = status === "completed" ? `${Math.floor(Math.random() * 31)}/30` : null;
      return { setNo, status, score };
    });

    setSets(generatedSets);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white px-6 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Custom Kanji Quiz 1 - Sets</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {sets.map((set) => (
          <SetBlock
            key={set.setNo}
            setNo={set.setNo}
            status={set.status}
            score={set.score}
            onClick={() => router.push(`/quiz/custom-1/set-${set.setNo}`)}
          />
        ))}
      </div>
    </div>
  );
}
