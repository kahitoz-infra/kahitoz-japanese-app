'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '../Quiz/components/QuizQuestion';
import ProgressBar from '../common_components/ProgressBar';
import { formatOption } from '../Quiz/utils/formatOption';

export default function AdaptiveQuizPageContent() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Format question for display
  const formatQuestionText = (q) => {
    if (typeof q === 'string') return q;
    if (Array.isArray(q)) return q.join(' ');
    if (typeof q === 'object' && q !== null) {
      return Object.values(q).join(' ');
    }
    return String(q);
  };

  useEffect(() => {
    const loadAdaptiveQuestions = () => {
      const rawData = localStorage.getItem('adaptive_quiz');
      if (!rawData) {
        console.error('adaptive_quiz not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(rawData);
        const setsData = parsed.sets_data || {};

        const allQuestions = Object.values(setsData)
          .flat()
          .filter((item) => item.type === 'question');

        if (allQuestions.length === 0) {
          console.error('No adaptive questions found');
        }

        setQuestions(allQuestions);
      } catch (err) {
        console.error('Error parsing adaptive_quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAdaptiveQuestions();
  }, []);

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentQuestion.correct_option;
    setIsCorrect(correct);
    setShowFeedback(true);

    const newResponse = {
      q_id: currentQuestion._id,
      correct,
    };
    setResponses((prev) => [...prev, newResponse]);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      localStorage.setItem('adaptive_quiz_responses', JSON.stringify(responses));
      router.push('/PostQuiz');
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
        <h1 className="text-2xl font-bold text-center mt-4">
          Question {currentIndex + 1}
        </h1>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 mt-4 pb-40">
        <QuizQuestion
          question={formatQuestionText(currentQuestion.question)}
          options={currentQuestion.options}
          name={`adaptive-q-${currentIndex}`}
          selectedOption={selectedOption}
          onSelect={handleOptionClick}
          type={currentQuestion.type}
        />

        {/* Controls + Feedback fixed at bottom */}
        <div className="fixed bottom-0 left-0 w-full">
          {showFeedback && (
            <div
              className={`w-full py-4 text-center text-lg font-semibold ${
                isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {isCorrect ? (
                <p>✅ Correct!</p>
              ) : (
                <p>
                  ❌ Incorrect. Correct Answer:{' '}
                  <span className="underline">
                    {formatOption(currentQuestion.correct_option, currentQuestion.type)}
                  </span>
                </p>
              )}
            </div>
          )}

          <button
            onClick={showFeedback ? handleNext : handleCheckAnswer}
            disabled={!selectedOption && !showFeedback}
            className={`w-full px-6 py-4 text-lg font-bold transition-all ${
              showFeedback
                ? isCorrect
                  ? 'bg-green-700 text-white'
                  : 'bg-red-700 text-white'
                : selectedOption
                ? 'bg-[#FF5274] dark:bg-[#F66538] text-white hover:opacity-90'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentIndex === totalQuestions - 1 && showFeedback
              ? 'Finish'
              : showFeedback
              ? 'Next'
              : 'Check'}
          </button>
        </div>
      </div>
    </div>
  );
}
