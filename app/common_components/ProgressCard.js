'use client';

import ProgressBar from '@/app/common_components/ProgressBar';

export default function ProgressCard({ correct = 0, incorrect = 0 }) {
  const total = correct + incorrect;

  return (
    <div
      className={`
        rounded-xl p-4 w-[280px] shadow-sm transition-colors
        bg-[#FAF9F6] dark:bg-[#2F2F2F]
      `}
    >
      {/* Progress Bar */}
      <ProgressBar
        label="Japanese Course"
        start={0}
        end={total}
        current={correct}
      />

      {/* Correct & Incorrect Boxes */}
      <div className="flex justify-between mt-4">
        {/* Correct */}
        <div
          className="flex flex-col items-center px-4 py-2 rounded-md"
          style={{ backgroundColor: '#FFD6E7' }}
        >
          <span className="text-2xl font-bold text-black">{correct}</span>
          <span className="text-sm text-black">Correct</span>
        </div>

        {/* Incorrect */}
        <div
          className="flex flex-col items-center px-4 py-2 rounded-md"
          style={{ backgroundColor: '#FFF0C9' }}
        >
          <span className="text-2xl font-semibold text-black">{incorrect}</span>
          <span className="text-sm text-black">Incorrect</span>
        </div>
      </div>
    </div>
  );
}
