'use client';

import ProgressBar from '@/app/common_components/ProgressBar';
import CustomButton from '@/app/common_components/CustomButton';
import QuizQuestion from '@/app/Quiz/components/QuizQuestion';
import Navbar from '@/app/common_components/Navbar';

export default function QuizPage() {
  return (
    <div className=" flex flex-col text-black dark:text-white">
      
      {/* Top Rectangle */}
      <div className="w-full h-[20vh] bg-gray-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        {/* Progress Bar */}
          <ProgressBar
            label="Progress"
            start={0}
            end={10}
            current={3}
          />
        {/* Quiz Title */}
        <h1 className="text-2xl font-bold text-black dark:text-white text-center justify-center mt-4">Basic Kanji Quiz</h1>
      </div>

      {/* Quiz Question Section */}
      <div className="flex-1 px-6">
        <QuizQuestion
          question="Which Kanji means 'Mountain'?"
          options={['川', '山', '木', '雨']}
          name="kanji-q3"
        />
      </div>

      {/* Next Button Section */}
      <div className="px-4 mt-8 flex justify-end">
        <CustomButton text="Next" link="/quiz/next" />
      </div>

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
}
