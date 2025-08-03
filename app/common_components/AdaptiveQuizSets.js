'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      setQuizzes([...stored].reverse()); // non-mutating reverse
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mt-8 mb-4">Adaptive Quiz Sets</h1>

      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes yet. Generate one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-[#333333] rounded-xl shadow-lg p-4 border border-[#FF5274] dark:border-[#F66538] transition hover:shadow-xl"
            >
              <p className="text-black mb-3 dark:text-white text-sm">
                {new Date(quiz.date).toLocaleString()}
              </p>
              <p className="font-semibold">
                Kanji Target: {quiz.kanjiTarget}, Vocab Target: {quiz.vocabTarget}
              </p>
              <p className="text-gray-600 dark:text-[#fafafa]">
                {quiz.quizData?.sets_data
                  ? Object.keys(quiz.quizData.sets_data).length + ' sets'
                  : 'No data'}
              </p>
              <button
                className="mt-3 px-4 py-2 bg-[#FF5274] dark:bg-[#F66538] hover:bg-blue-600 text-white rounded-lg"
                onClick={() => handlePlay(quiz)}
              >
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
