'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from './QuizQuestion';
import ProgressBar from './ProgressBar';
import { formatOption } from '../utils/formatOption';

export default function AdaptiveQuizPageContent() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryResponses, setRetryResponses] = useState([]);


  const [retryMode, setRetryMode] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const formatQuestionText = (q) => {
    if (typeof q === 'string') return q;
    if (Array.isArray(q)) return q.join(' ');
    if (typeof q === 'object' && q !== null) return Object.values(q).join(' ');
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

        setQuestions(allQuestions);
        setOriginalQuestions(allQuestions);
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

    if (retryMode) {
      // Update retry responses list
      setRetryResponses((prev) => {
        const updated = prev.filter((r) => r.q_id !== currentQuestion._id);
        if (!correct) {
          updated.push(newResponse); // Keep only incorrect ones
        }
        return updated;
      });
    }
  };

  const handleNext = () => {
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const currentCorrect = selectedOption === currentQuestion.correct_option;

  if (isLastQuestion) {
    const finalResponse = {
      q_id: currentQuestion._id,
      correct: currentCorrect,
    };
    const updatedResponses = [...responses, finalResponse];

    if (!retryMode) {
      const incorrectQIDs = updatedResponses
        .filter((res) => !res.correct)
        .map((res) => res.q_id);

      if (incorrectQIDs.length > 0) {
        const incorrectQs = originalQuestions.filter((q) =>
          incorrectQIDs.includes(q._id)
        );
        setResponses(updatedResponses);
        setQuestions(incorrectQs);
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setRetryMode(true);
        setRetryResponses(incorrectQs.map((q) => ({ q_id: q._id, correct: false })));
      } else {
        saveAndRedirect(updatedResponses);
      }
    } else {
      // RetryMode: check if retryResponses is empty
      if (retryResponses.length === 0) {
        saveAndRedirect(responses); // Done, all correct
      } else {
        // Retry again only incorrect ones
        const retryQs = originalQuestions.filter((q) =>
          retryResponses.some((r) => r.q_id === q._id && !r.correct)
        );
        setQuestions(retryQs);
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }
  } else {
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setShowFeedback(false);
  }
};


  const saveAndRedirect = (finalResponses) => {
    const quizResult = {
      timestamp: Date.now(),
      responses: finalResponses,
    };

    localStorage.setItem('adaptive_quiz_responses', JSON.stringify(quizResult));
    router.push('/PostQuiz');
  };

  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (!currentQuestion) return <p className="p-4 text-center">No questions found.</p>;

  return (
    <div className="flex flex-col min-h-screen text-black dark:text-white">
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <ProgressBar
          label={retryMode ? 'Retry Progress' : 'Progress'}
          start={0}
          end={totalQuestions}
          current={currentIndex + 1}
        />
        <h1 className="text-2xl font-bold text-center mt-4">
          {retryMode ? 'Previous Mistake Revisit' : `Question ${currentIndex + 1}`}
        </h1>
      </div>

      <div className="flex-1 px-6 mt-4 pb-40">
        <QuizQuestion
          question={formatQuestionText(currentQuestion.question)}
          options={currentQuestion.options}
          name={`adaptive-q-${currentIndex}`}
          selectedOption={selectedOption}
          onSelect={handleOptionClick}
          type={currentQuestion.type}
        />

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
              ? retryMode
                ? 'Finish Retry'
                : 'Retry Incorrect'
              : showFeedback
              ? 'Next'
              : 'Check'}
          </button>
        </div>
      </div>
    </div>
  );
}
