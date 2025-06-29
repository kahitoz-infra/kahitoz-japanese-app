'use client';

import ProgressCard from './components/ProgressCard';
import CustomButton from '@/app/common_components/CustomButton';
import SecondaryButton from '@/app/common_components/SecondaryButton';
import Navbar from '@/app/common_components/Navbar';
import CherryBlossomSnowfall from '@/app/common_components/CherryBlossomSnowfall';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PostQuizPage() {

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [responses, setResponses] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

useEffect(() => {
  const raw = localStorage.getItem('quizResponses');
  if (raw) {
    const parsed = JSON.parse(raw);
    setResponses(parsed);
    const correctCount = parsed.filter(r => r.correct).length;
    const incorrectCount = parsed.filter(r => !r.correct).length;
    setCorrect(correctCount);
    setIncorrect(incorrectCount);
  }
}, []);


  useEffect(() => {
    // Detect dark mode using matchMedia
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(match.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    match.addEventListener('change', listener);
    return () => match.removeEventListener('change', listener);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#333333] text-white relative z-10">
      
      {/* Cherry blossom background (behind everything) */}
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />

      {/* Main content */}
      <div className="flex flex-col items-center justify-center gap-6 py-10 px-4 relative z-10">
        
        <div className="w-24 h-24 rounded-full relative border border-gray-400 mt-4 overflow-hidden">
  <Image
    src="/chibi_well_done.png" // Ensure this image exists in your /public folder
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

        {/* Progress Card */}
        <ProgressCard correct={correct} incorrect={incorrect} />

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <CustomButton text="Review Answers" href="/Review" />
          <SecondaryButton text="Try Again" href="/Quiz" />
        </div>

      </div>

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
}
