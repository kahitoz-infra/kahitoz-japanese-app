'use client';
import { useState, useEffect } from 'react';
import CherryBlossomSnowfall from "./CherryBlossomSnowfall";

// --- Main Adaptive Quiz Sets Component ---
export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    try {
      if (!localStorage.getItem('adaptive_quiz_list')) {
        const mockQuizzes = [
          { id: 1, quizData: { sets_data: { set1: [] } } },
          { id: 2, quizData: { sets_data: { set1: [], set2: [] } } },
          { id: 3, quizData: { sets_data: { set1: [], set2: [], set3: [], set4: [] } } },
        ];
        localStorage.setItem('adaptive_quiz_list', JSON.stringify(mockQuizzes));
      }
      const stored = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      setQuizzes(stored);
    } catch (err) {
      console.error('Failed to parse adaptive_quiz_list:', err);
      setQuizzes([]);
    }
  }, []);

  const handlePlay = (quiz) => {
    localStorage.setItem('adaptive_quiz', JSON.stringify(quiz.quizData));
    window.location.href = '/TargetLearning';
  };

  // --- Zigzag Alignment Logic ---
  const getAlignment = (index) => {
    if ((index + 1) % 4 === 0) {
      return "justify-start"; // left
    }
    if (index % 2 === 0) {
      return "justify-center"; // center
    }
    return "justify-end"; // right
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center w-screen py-8">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />
      
      {/* Quiz List or Empty Message */}
      {quizzes.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No quizzes yet.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Generate one to get started!</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-y-16 w-full max-w-4xl px-4">
          {quizzes.map((quiz, index) => {
            const isNewest = index === quizzes.length - 1;
            const progress = Math.min(((index + 1) * 25), 100);

            return (
              <div key={quiz.id} className={`flex ${getAlignment(index)}`}>
                <div className="flex flex-col items-center w-32">
                  <div className="relative">
                    {/* Play button */}
                    <div
                      className={`w-20 h-20 flex items-center justify-center rounded-full shadow-md border-4 transition-all duration-300 cursor-pointer
                        ${isNewest ? 'dark:bg-[#F66538] bg-[#FF5274]' : 'dark:bg-gray-600 bg-gray-400'} 
                        hover:scale-105`}
                      onClick={() => handlePlay(quiz)}
                    >
                      <span className="text-white font-bold text-xl">▶</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full mt-3">
                      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF5274] dark:bg-[#F66538] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
