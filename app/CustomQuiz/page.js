'use client'
import QuizBlock from "../CustomQuiz/components/QuizBlock";
import Navbar from "../common_components/Navbar";
import CircularButton from "../common_components/CircularButton";

export default function CustomQuizPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-[#2f2f2f] relative">
      {/* Top Header */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-black dark:text-white text-center">
          Zen Kanji Quiz Section
        </h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-4 pb-6 px-4">
        <QuizBlock />
        
      </main>
      <div className="absolute z-10 bottom-24 right-4">
    <CircularButton href="/PreQuiz" />
    </div>
      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
}
