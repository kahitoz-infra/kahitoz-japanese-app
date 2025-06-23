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
      const lastAttempted =
        status !== "not attempted"
          ? new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
          : null;

      return { setNo, status, score, lastAttempted };
    });

    setSets(generatedSets);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white relative">
      {/* Top Rectangle */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl flex items-center justify-center relative z-0">
        {/* Centered Heading */}
        <h1 className="text-2xl font-bold text-center z-10">
          Custom Kanji Quiz 1 - Sets
        </h1>
      </div>

      {/* Sets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 max-w-4xl mx-auto px-6 py-8">
        {sets.map((set) => (
          <SetBlock
            key={set.setNo}
            setNo={set.setNo}
            status={set.status}
            score={set.score}
            lastAttempted={set.lastAttempted} // ✅ Pass here
            onClick={() => router.push(`/Quiz`)}
          />
        ))}
      </div>
    </div>
  );
}
