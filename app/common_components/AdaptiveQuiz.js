'use client';

import { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import ProgressBar from './ProgressBar';
import { formatOption } from '../utils/formatOption';

export default function AdaptiveQuizPageContent({ data, onComplete }) {
  const [questions, setQuestions] = useState(data);
  const [originalQuestions] = useState(data);
  const [responses, setResponses] = useState([]);
  const [firstAttemptResponses, setFirstAttemptResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [retryMode, setRetryMode] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = originalQuestions.length;
  const isLast = currentIndex === questions.length - 1;

  if (!currentQuestion) {
    onComplete(retryMode ? firstAttemptResponses : responses);
    return null;
  }

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const correct = selectedOption === currentQuestion.correct_option;
    setIsCorrect(correct);
    setShowFeedback(true);
    setResponses(prev => [...prev, { q_id: currentQuestion._id, correct }]);
  };

  const handleNext = () => {
    if (isLast) {
      if (!retryMode) {
        const incorrect = responses.filter(r => !r.correct).map(r => r.q_id);
        if (incorrect.length > 0) {
          setFirstAttemptResponses(responses);
          const incorrectQs = originalQuestions.filter(q => incorrect.includes(q._id));
          setQuestions(incorrectQs);
          setCurrentIndex(0);
          setSelectedOption(null);
          setShowFeedback(false);
          setRetryMode(true);
        } else {
          onComplete(responses);
        }
      } else {
        onComplete(firstAttemptResponses);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const progressCurrent = retryMode ? totalQuestions - questions.length + currentIndex + 1 : currentIndex + 1;

  return (
    <div className="flex flex-col min-h-screen text-black dark:text-white">
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <ProgressBar
          label={retryMode ? 'Reattempt Progress' : 'Progress'}
          start={0}
          end={totalQuestions}
          current={progressCurrent}
        />
        <h1 className="text-2xl font-bold text-center mt-4">
          {retryMode ? 'Previous Mistake' : `Question ${currentIndex + 1} of ${originalQuestions.length}`}
        </h1>
      </div>

      <div className="flex-1 px-6 mt-4 pb-40">
        <QuizQuestion
          question={currentQuestion.question}
          options={currentQuestion.options}
          name={`adaptive-q-${currentIndex}`}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          type={currentQuestion.type}
        />

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
                ? 'Finish Quiz'
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