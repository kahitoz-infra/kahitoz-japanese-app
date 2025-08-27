'use client';

import { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import ProgressBar from './ProgressBar';
import { formatOption } from '../utils/formatOption';

export default function AdaptiveQuizPageContent({ data, onComplete }) {
  const [questions, setQuestions] = useState(data);
  const [originalQuestions] = useState(data);
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const [retryResponses, setRetryResponses] = useState([]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLast = currentIndex === totalQuestions - 1; // ✅ moved here globally

  if (!currentQuestion) {
    onComplete();
    return null;
  }

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const correct = selectedOption === currentQuestion.correct_option;
    setIsCorrect(correct);
    setShowFeedback(true);
    setResponses(prev => [...prev, { q_id: currentQuestion._id, correct }]);

    if (retryMode) {
      setRetryResponses(prev => {
        const updated = prev.filter(r => r.q_id !== currentQuestion._id);
        if (!correct) updated.push({ q_id: currentQuestion._id, correct: false });
        return updated;
      });
    }
  };

  const handleNext = () => {
    if (isLast) {
      if (!retryMode) {
        const incorrect = responses.filter(r => !r.correct).map(r => r.q_id);
        if (incorrect.length > 0) {
          const incorrectQs = originalQuestions.filter(q => incorrect.includes(q._id));
          setQuestions(incorrectQs);
          setCurrentIndex(0);
          setSelectedOption(null);
          setShowFeedback(false);
          setRetryMode(true);
          setRetryResponses(incorrectQs.map(q => ({ q_id: q._id, correct: false })));
        } else {
          onComplete();
        }
      } else {
        if (retryResponses.length === 0) {
          onComplete();
        } else {
          const retryQs = originalQuestions.filter(q =>
            retryResponses.some(r => r.q_id === q._id && !r.correct)
          );
          setQuestions(retryQs);
          setCurrentIndex(0);
          setSelectedOption(null);
          setShowFeedback(false);
        }
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-black dark:text-white">
      {/* Header */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <ProgressBar
          label={retryMode ? 'Reattempt Progress' : 'Progress'}
          start={0}
          end={totalQuestions}
          current={currentIndex + 1}
        />
        <h1 className="text-2xl font-bold text-center mt-4">
          {retryMode ? 'Previous Mistake' : `Question ${currentIndex + 1}`}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 mt-4 pb-40">
        <QuizQuestion
          question={currentQuestion.question}
          options={currentQuestion.options}
          name={`adaptive-q-${currentIndex}`}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          type={currentQuestion.type}
        />

        {/* Footer */}
        <div className="fixed bottom-0 left-0 w-full">
          {showFeedback && (
            <div
              className={`w-full py-4 text-center text-lg font-semibold ${
                isCorrect ? 'bg-green-600' : 'bg-red-600'
              } text-white`}
            >
              {isCorrect
                ? '✅ Correct!'
                : <>❌ Incorrect. Correct Answer: <u>{formatOption(currentQuestion.correct_option, currentQuestion.type)}</u></>}
            </div>
          )}
          <button
            onClick={showFeedback ? handleNext : handleCheckAnswer}
            disabled={!selectedOption && !showFeedback}
            className="w-full px-6 py-4 text-lg font-bold bg-[#FF5274] dark:bg-[#F66538] text-white"
          >
            {isLast && showFeedback
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
