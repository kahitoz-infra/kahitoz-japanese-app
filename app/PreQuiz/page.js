'use client';

import JLPTLevelSelector from "./components/JLPTSelect";
import Navbar from "../common_components/Navbar";

export default function JLPTQuizSetupPage() {
  return (
    <div className="flex flex-col text-black dark:text-white min-h-screen">
      {/* Top Rectangle */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        
        {/* Quiz Setup Title */}
        <h1 className="text-2xl font-bold text-black dark:text-white text-center mt-4">
          Zen Kanji Quiz Section
        </h1>
      </div>

      {/* JLPT Level Selector */}
      <div className="mt-10">
        <JLPTLevelSelector />

        {/* Bottom Navbar */}
              <Navbar />
      </div>
    </div>
  );
}
