'use client';

import { useRouter } from 'next/navigation';
import SetBlock from './components/SetBlock';

export default function SetsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white relative">
      {/* Top Rectangle */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl flex items-center justify-center relative z-0">
        <h1 className="text-2xl font-bold text-center z-10">
          Custom Kanji Quiz 1 - Sets
        </h1>
      </div>

      {/* Sets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 max-w-4xl mx-auto px-6 py-8">
        {/* Example SetBlocks with manual routing */}
        <SetBlock
          setNo={1}
          status="completed"
          score="28/30"
          lastAttempted="2025-06-22"
          onClick={() => router.push('/Quiz/MCQ')}
        />
        <SetBlock
          setNo={2}
          status="attempted"
          lastAttempted="2025-06-20"
          onClick={() => router.push('/Quiz/Blanks')}
        />
        <SetBlock
          setNo={3}
          status="not attempted"
          onClick={() => router.push('/Quiz/Match')}
        />
        <SetBlock
          setNo={4}
          status="completed"
          score="30/30"
          lastAttempted="2025-06-19"
          onClick={() => router.push('/Quiz/Blanks')}
        />
        {/* Repeat up to 12 */}
      </div>
    </div>
  );
}
