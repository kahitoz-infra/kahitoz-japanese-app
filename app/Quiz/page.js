'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuizQuestion from './components/QuizQuestion';
import ProgressBar from '../common_components/ProgressBar';
import { authFetch } from '../middleware';
import { formatOption } from './utils/formatOption';

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setNo = searchParams.get('setNo');
  const type = searchParams.get('type');
  const quizNumber = searchParams.get('quiz_number');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!setNo || !type || !quizNumber) return;

      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_LEARN}/set_question?quiz_type=${type}&quiz_number=${quizNumber}&set_number=${setNo}`
        );
        const data = await res.json();

        if (res.ok && data.questions) {
          setQuestions(data.questions);
        } else {
          console.error(data.detail || 'Failed to load questions');
        }
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (!showFeedback) {
      const correct = selectedOption === currentQuestion.correct_option;
      setIsCorrect(correct);
      setShowFeedback(true);
      return;
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      alert("Quiz complete!");
      router.push("/CustomQuiz");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (!currentQuestion) return <p className="p-4 text-center">No questions found.</p>;

  return (
    <div className="flex flex-col min-h-screen text-black dark:text-white">
      {/* Header */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <ProgressBar
          label="Progress"
          start={0}
          end={totalQuestions}
          current={currentIndex + 1}
        />
        <h1 className="text-2xl font-bold text-center mt-4">Question {currentIndex + 1}</h1>
      </div>

{/* Question Area */}
      <div className="flex-1 px-6 mt-4">
        <QuizQuestion
          question={currentQuestion.question}
          options={currentQuestion.options}
          name={`quiz-q-${currentIndex}`}
          selectedOption={selectedOption}
          onSelect={handleOptionClick}
          type={currentQuestion.type}
        />

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-4 font-semibold">
            {isCorrect ? (
              <p className="text-green-600">Correct!</p>
            ) : (
              <p className="text-red-500">
                Incorrect. Correct Answer:{" "}
                <span className="underline">
                  {formatOption(currentQuestion.correct_option, currentQuestion.type)}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Button Row: Quit (left) + Next (right) */}
      <div className="flex justify-between items-center px-6 mt-6 mb-8">
        {/* Quit Button */}
        <button
          onClick={() => router.push('/CustomQuiz')}
          className="px-6 py-3 rounded-lg font-semibold border border-gray-400 text-gray-700 dark:text-white dark:border-gray-600"
        >
          Quit
        </button>

        {/* Next / Check / Finish Button */}
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className={`px-6 py-3 rounded-lg font-semibold transition-all
            ${
              selectedOption
                ? 'bg-[#FF5274] dark:bg-[#F66538] text-white hover:opacity-90'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          {currentIndex === totalQuestions - 1 ? "Finish" : showFeedback ? "Next" : "Check"}
        </button>
      </div>
    </div>
  );
}
