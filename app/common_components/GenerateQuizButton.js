'use client';
import { useGenerateAdaptiveQuiz } from '@/app/utils/generateAdaptiveQuiz';
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function QuickStartButton() {
  const generateQuiz = useGenerateAdaptiveQuiz();

  const handleQuickStart = async () => {
    const now = Date.now();

    localStorage.setItem(
      'kanji_target',
      JSON.stringify({ value: 4, timestamp: now })
    );
    localStorage.setItem(
      'vocab_target',
      JSON.stringify({ value: 8, timestamp: now })
    );

    await generateQuiz();
  };

  return (
    <button
      onClick={handleQuickStart}
      className="w-14 h-14 flex items-center justify-center rounded-full 
                bg-[#FFB8C6] dark:bg-[#FF6E41] shadow-lg 
                 transition-transform hover:scale-110
                 text-white dark:text-black"
      aria-label="Quick Start"
    >
      <PaperAirplaneIcon className="w-7 h-7" />
    </button>
  );
}
