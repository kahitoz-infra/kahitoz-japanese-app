'use client';
import { useState, useEffect } from 'react';
import CherryBlossomSnowfall from "./CherryBlossomSnowfall";
import QuickStartButton from "@/app/common_components/GenerateQuizButton";

export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [completedSetsTracker, setCompletedSetsTracker] = useState({});

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Read the latest state from local storage on component mount
    const storedQuizzes = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
    setQuizzes(storedQuizzes);
    
    const tracker = JSON.parse(localStorage.getItem('completed_sets_tracker') || '{}');
    setCompletedSetsTracker(tracker);
  }, []);

  const handlePlay = (quiz) => {
    const fullQuizData = quizzes.find(q => q.id === quiz.id)?.quizData;
    if (!fullQuizData) return;

    const quizId = fullQuizData.quiz_id;
    const allSetNames = Object.keys(fullQuizData.sets_data);
    const completedSetNames = completedSetsTracker[quizId] || [];
    
    const nextSetToPlay = allSetNames.find(setName => !completedSetNames.includes(setName));

    if (nextSetToPlay) {
      const quizDataForNextSet = {
        ...fullQuizData,
        sets_data: {
          [nextSetToPlay]: fullQuizData.sets_data[nextSetToPlay]
        }
      };
      localStorage.setItem('adaptive_quiz', JSON.stringify(quizDataForNextSet));
      window.location.href = '/TargetLearning';
    } else {
      alert("You have completed this quiz!");
    }
  };

  const getAlignment = (index) => {
    if ((index + 1) % 4 === 0) return "justify-start";
    if (index % 2 === 0) return "justify-center";
    return "justify-end";
  };

  const isLatestQuizCompleted = () => {
    if (quizzes.length === 0) return true;
    const latestQuiz = quizzes[quizzes.length - 1];
    const quizId = latestQuiz.quizData.quiz_id;
    const totalSets = Object.keys(latestQuiz.quizData.sets_data).length;
    const completedCount = (completedSetsTracker[quizId] || []).length;
    return completedCount >= totalSets;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center w-screen bg-gray-100 dark:bg-[#2f2f2f] py-8">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />
      {quizzes.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No quizzes yet.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Generate one to get started!</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-y-16 w-full max-w-4xl px-4">
          {quizzes.map((quiz, index) => {
            const quizId = quiz.quizData.quiz_id;
            const totalSets = Object.keys(quiz.quizData.sets_data).length;
            const completedCount = (completedSetsTracker[quizId] || []).length;
            const progress = totalSets > 0 ? (completedCount / totalSets) * 100 : 0;
            const isCompleted = completedCount >= totalSets;

            return (
              <div key={quiz.id} className={`flex ${getAlignment(index)}`}>
                <div className="flex flex-col items-center w-32">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 flex items-center justify-center rounded-full shadow-md border-4 transition-all duration-300 cursor-pointer
                        ${!isCompleted ? 'dark:bg-[#F66538] bg-[#FF5274]' : 'dark:bg-gray-600 bg-gray-400'}
                        hover:scale-105`}
                      onClick={() => !isCompleted && handlePlay(quiz)}
                    >
                      <span className="text-white font-bold text-xl">▶</span>
                    </div>
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
      <div className="fixed bottom-32 right-6 z-50">
        <QuickStartButton disabled={!isLatestQuizCompleted()} />
      </div>
    </div>
  );
}