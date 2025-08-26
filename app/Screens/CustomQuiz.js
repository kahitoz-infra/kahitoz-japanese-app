'use client'
import { useState } from 'react';
import QuizBlock from "../common_components/QuizBlock";
import CircularButton from "../common_components/CircularButton";
import AdaptiveQuizSets from '../common_components/AdaptiveQuizSets';

export default function CustomQuizPage() {
  const [activeTab, setActiveTab] = useState('custom');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-[#2f2f2f] relative">
      {/* Top Header */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-black dark:text-white text-center">
          Zen Kanji Quiz Section
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="w-full flex justify-center space-x-4 p-4">
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-2 rounded-full ${
            activeTab === 'custom'
              ? 'bg-[#FF5274] dark:bg-[#F66538] text-white font-bold'
              : 'bg-gray-200 dark:bg-gray-500 text-black font-bold dark:text-gray-200'
          }`}
        >
          Custom Quiz
        </button>
        <button
          onClick={() => setActiveTab('adaptive')}
          className={`px-6 py-2 rounded-full ${
            activeTab === 'adaptive'
              ? 'bg-[#FF5274] dark:bg-[#F66538] text-white font-bold'
              : 'bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-gray-200 font-bold'
          }`}
        >
          Adaptive Quiz
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-4 pb-6 px-4">
        {activeTab === 'custom' ? (
          <>
            <QuizBlock />
            <div className="fixed z-10 bottom-20 right-3">
              <CircularButton href="/PreQuiz" />
            </div>
          </>
        ) : (
          <AdaptiveQuizSets />
        )}
      </main>
    </div>
  );
}
