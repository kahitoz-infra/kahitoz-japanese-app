'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      setQuizzes([...stored].reverse()); // Newest is at index 0
    } catch (err) {
      console.error('Failed to parse adaptive_quiz_list:', err);
      setQuizzes([]);
    }
  }, []);

  const handlePlay = (quiz) => {
    localStorage.setItem('adaptive_quiz', JSON.stringify(quiz.quizData));
    router.push('/TargetLearning');
  };

  return (
    <div className="flex flex-col items-center py-8 relative">
      {/* Title */}
      <div className="w-full max-w-md px-4">
        <div className="relative bg-white border shadow-sm border-[#FF5274] dark:border-[#F66538] dark:bg-gray-100 rounded-full mt-2 py-3 px-6">
          <h1 className="text-center text-xl font-bold text-black dark:text-black">
            Adaptive Quiz Sets
          </h1>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-gray-500 dark:text-white mt-6">
          No quizzes yet. Generate one to get started!
        </p>
      ) : (
        quizzes.map((quiz, index) => {
          const isLatest = index === quizzes.length - 1; // Last one in array = oldest
          return (
            <div key={quiz.id} className="relative flex flex-col items-center mt-6">
              {/* Play Button */}
              <div
                className="relative z-10 flex items-center justify-center rounded-full shadow-sm border-4 dark:bg-[#F66538] bg-[#FF5274] hover:scale-105 transition-transform cursor-pointer"
                style={{
                  width: isLatest ? '88px' : '80px',
                  height: isLatest ? '88px' : '80px',
                }}
                onClick={() => handlePlay(quiz)}
              >
                <span className="text-white text-lg font-bold">▶</span>
              </div>

              {/* Dotted connector line */}
              {index < quizzes.length - 1 && (
                <div
                  className="border-l-4 border-dotted border-[#FF5274] dark:border-[#F66538]"
                  style={{
                    height: '60px',
                    marginTop: '10px',
                  }}
                ></div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
