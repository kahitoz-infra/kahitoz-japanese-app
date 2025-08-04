'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      setQuizzes([...stored].reverse());
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
      {quizzes.length === 0 ? (
        <p className="text-gray-500 dark:text-white">No quizzes yet. Generate one to get started!</p>
      ) : (
        quizzes.map((quiz, index) => (
          <div key={quiz.id} className="relative flex flex-col items-center">
            {/* Connector line between circles */}
            {index < quizzes.length - 1 && (
              <svg
                className="absolute top-full"
                width="80"
                height="100"
                viewBox="0 0 80 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  left: index % 2 === 0 ? '50%' : '-50%',
                  transform: index % 2 === 0 ? 'translateX(0)' : 'translateX(100%) scaleX(-1)',
                }}
              >
                <path
                  d="M40 0 C 70 40, 10 60, 40 100"
                  stroke="#FF5274"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span className='text-centre flex items-center justify-center text-4xl px-4 py-8 font-bold'>
              Adaptive Quiz Sets
            </span>
            {/* Button */}
            <div
              className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full shadow-sm border-4 dark:bg-[#F66538] bg-[#FF5274] hover:scale-105 transition-transform cursor-pointer ${
                index % 2 === 0 ? 'self-start ml-10' : 'self-end mr-10'
              }`}
              onClick={() => handlePlay(quiz)}
            >
              <span className="text-white text-lg font-bold">▶</span>
            </div>

            {/* Spacing for next item */}
            <div className="h-20"></div>
          </div>
        ))
      )}
    </div>
  );
}
