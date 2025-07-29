'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import ProgressCard from '../common_components/ProgressCard';
import CherryBlossomSnowfall from '@/app/common_components/CherryBlossomSnowfall';

export default function PostQuizPage() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [responses, setResponses] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  useEffect(() => {
    const raw =
      localStorage.getItem('adaptive_quiz_responses') ||
      localStorage.getItem('quizResponses');

    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        // Handle both array and object format
        const respArray = Array.isArray(parsed)
          ? parsed
          : parsed.responses || [];

        setResponses(respArray);

        const correctCount = respArray.filter((r) => r.correct).length;
        const incorrectCount = respArray.filter((r) => !r.correct).length;

        setCorrect(correctCount);
        setIncorrect(incorrectCount);
      } catch (error) {
        console.error('Failed to parse stored responses:', error);
      }
    }
  }, []);

  useEffect(() => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(match.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    match.addEventListener('change', listener);
    return () => match.removeEventListener('change', listener);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#333333] text-white relative z-10">
      {/* Background Animation */}
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center gap-6 py-10 px-4 relative z-10">
        {/* Character Image */}
        <div className="w-24 h-24 dark:hidden rounded-full relative border-b-2 border-[#FF5274] mt-4 overflow-hidden">
          <Image
            src="/chibi_well_done.png"
            alt="Well done"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-24 h-24 hidden dark:flex rounded-full relative border-b-2 border-[#F66538] mt-4 overflow-hidden">
          <Image
            src="/chibi_well_done_dark.png"
            alt="Well done"
            fill
            className="object-cover"
          />
        </div>

        {/* Heading */}
        <div className="text-center text-black dark:text-white">
          <h1 className="text-3xl font-bold mt-4">よくできました</h1>
          <p className="text-md mt-1">Well done</p>
        </div>

        {/* Score Summary */}
        <ProgressCard correct={correct} incorrect={incorrect} />

        {/* Back to Homepage Button */}
        <div className="p-4">
          <button
            onClick={() => router.push('/')}
            className="text-sm px-4 py-4 font-semibold bg-[#FF3A60] dark:bg-white text:white dark:text-black rounded-2xl"
          >
            &lt; Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
