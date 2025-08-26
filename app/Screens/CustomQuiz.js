'use client'
import { useState } from 'react';
import QuizBlock from "../common_components/QuizBlock";
import CircularButton from "../common_components/CircularButton";
import AdaptiveQuizSets from '../common_components/AdaptiveQuizSets';

export default function CustomQuizPage() {
  const [activeTab, setActiveTab] = useState('custom');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-[#2f2f2f] relative">

      {/* Tab Navigation */}
      <div className="w-full flex justify-center space-x-4 p-4 mt-10">
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
      <main className="flex-1 w-full flex flex-col items-center justify-start pt-4 pb-6">
        {activeTab === 'custom' ? (
          <>
            <QuizBlock />
            <div className="fixed z-10 bottom-20 right-3">
              <CircularButton href="/PreQuiz" />
            </div>
          </>
        ) : (
          <div className="h-screen">
            <AdaptiveQuizSets />
          </div>
        )}
      </main>
    </div>
  );
}
