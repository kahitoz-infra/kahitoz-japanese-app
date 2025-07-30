'use client';

import ProgressBar from '@/app/common_components/ProgressBar';
import CustomButton from '@/app/common_components/CustomButton';
import MatchColumn from '@/app/common_components/MatchColumn';
import Navbar from '@/app/common_components/Navbar';

export default function MatchPage() {
  return (
    <div className="flex flex-col text-black dark:text-white">

      {/* Top Rectangle */}
      <div className="w-full h-[20vh] bg-gray-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <ProgressBar label="Progress" start={0} end={10} current={4} />
        <h1 className="text-2xl font-bold text-black dark:text-white text-center mt-4">Match the Kanji</h1>
      </div>

      {/* Match Question Section */}
      <div className="flex-1 px-6">
        <MatchColumn
          question="Match the Kanji with its meaning"
          leftItems={['山', '川', '木', '火']}
          rightItems={['Tree', 'Fire', 'River', 'Mountain']}
          name="match-q4"
        />
      </div>

      {/* Next Button Section */}
      <div className="px-4 mt-8 flex justify-end">
        <CustomButton text="Next" link="/quiz/next" />
      </div>

      <Navbar />
    </div>
  );
}
