'use client';

import ProgressCard from './components/ProgressCard';
import CustomButton from '@/app/common_components/CustomButton';
import SecondaryButton from '@/app/common_components/SecondaryButton';
import Navbar from '@/app/common_components/Navbar';
import MotivationalQuotes from '@/app/common_components/MotivationalQuotes';
import CherryBlossomSnowfall from '@/app/common_components/CherryBlossomSnowfall';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PostQuizPage() {
  const correct = 7;
  const incorrect = 3;

  const [isDarkMode, setIsDarkMode] = useState(false);

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
        
        {/* Image above heading */}
        <div className="w-24 h-24 relative border border-gray-400 mt-4">
          <Image
            src="/celebration.png" // Ensure this image exists in your /public folder
            alt="Well done"
            fill
            className="object-contain rounded-lg"
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

        {/* Motivational Quotes */}
        <div className="mt-1">
          <MotivationalQuotes />
        </div>
      </div>

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
}
